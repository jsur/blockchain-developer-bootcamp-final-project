const Rentals = artifacts.require("./Rentals.sol");

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
};

const addFirstProperty = async (instance, tx = {}) => {
  await instance.addProperty(
    web3.utils.toWei("0.00156"),
    "Hämeentie 77",
    "Duplex with a nice view",
    "https://google.com",
    "https://www.hermannikuvia.fi/wp-content/uploads/Hameentie-77-sisapiha.jpg",
    tx
  );
};

const addSecondProperty = async (instance, tx = {}) => {
  await instance.addProperty(
    web3.utils.toWei("0.002"),
    "Mannerheimintie 30 A",
    "Duplex with a really bad view",
    "https://google.com",
    "https://www.finna.fi/Cover/Show?id=hkm.HKMS000005%3Akm002zsb&index=0&size=large&source=Solr",
    tx
  );
};

const ERR_NOT_VACANT = "This property is not vacant.";
const ERR_EXACT_AMOUNT = "Please pay exact rent amount.";
const ERR_NOT_OWNER = "Ownable: caller is not the owner";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const Status = {
  VACANT: 0,
  RENTED: 1,
  NOT_AVAILABLE: 2,
};

contract("Rentals", function (accounts) {
  const [owner, secondAccount] = accounts;

  beforeEach(async () => {
    instance = await Rentals.new();
    await addFirstProperty(instance, { from: owner });
    await addSecondProperty(instance, { from: owner });
  });

  /**
   * Checks that the contract inherits OpenZeppelin Ownable by using owner()
   */
  it("should add first account as owner using OpenZeppelin Ownable", async () => {
    assert.strictEqual(await instance.owner(), owner);
  });

  describe("addAsTenant()", () => {
    /**
     * Adds a tenant to a property and then tries to do it again.
     */
    it("should fail if property is not vacant", async () => {
      await instance.addAsTenant(0);
      try {
        await instance.addAsTenant(0);
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_NOT_VACANT);
      }
    });

    /**
     * Attempt to add a tenant with the wrong rent amount.
     */
    it("should fail if payment is not exact", async () => {
      try {
        await instance.addAsTenant(0, { value: web3.utils.toWei("0.00140") });
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_EXACT_AMOUNT);
      }
    });

    /**
     * First checks that a listing is vacant, then adds a tenant. Then verifies the status changes to Rented.
     */
    it("should add tenant to a listing and change listing status", async () => {
      const LISTING_ID = 1;
      const actualBefore = await instance.properties(LISTING_ID);
      assert.equal(actualBefore.status.toNumber(), Status.VACANT);

      await instance.addAsTenant(LISTING_ID, {
        from: secondAccount,
        value: web3.utils.toWei("0.00156"),
      });

      const actual = await instance.properties(LISTING_ID);
      assert.equal(actual.tenant, secondAccount);
      assert.equal(actual.status.toNumber(), Status.RENTED);
    });

    /**
     * Verifies the rentAmount is sent to the owner address in full.
     */
    it("should send given rentAmount to owner address", async () => {
      const LISTING_ID = 1;
      const balanceBefore = await web3.eth.getBalance(owner);
      await instance.addAsTenant(LISTING_ID, {
        from: secondAccount,
        value: web3.utils.toWei("0.00156"),
      });
      const balanceAfter = await web3.eth.getBalance(owner);
      const listing = await instance.properties(LISTING_ID);
      const rent = listing.currentRentAmount.toNumber();
      assert.equal(balanceAfter - balanceBefore, rent);
    });
  });

  describe("addProperty()", () => {
    /**
     * Verify ownable usage in function.
     */
    it("should allow only the owner to add properties", async () => {
      try {
        await addFirstProperty(instance, { from: secondAccount });
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_NOT_OWNER);
      }
    });

    /**
     * Verify:
     * * given property gets added to properties mapping
     * * length counter gets incremented
     */
    it("should add a property to properties mapping", async () => {
      const idListLengthBefore = await instance.idListLength();
      await addSecondProperty(instance, { from: owner });
      const idListLengthAfter = await instance.idListLength();
      assert.equal(
        idListLengthAfter.toNumber(),
        idListLengthBefore.toNumber() + 1
      );
      const { tenant } = await instance.properties(3);
      assert.equal(tenant, ADDRESS_ZERO);
    });
  });
});
