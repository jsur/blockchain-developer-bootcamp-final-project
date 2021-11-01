const Rentals = artifacts.require("./Rentals.sol");

contract("Rentals", function (accounts) {
  const [owner, secondAccount] = accounts;

  beforeEach(async () => {
    instance = await Rentals.new();
    instance.addProperty(
      web3.utils.toWei("0.00156"),
      "Hämeentie 77",
      "Duplex with a nice view",
      "https://google.com",
      "https://www.hermannikuvia.fi/wp-content/uploads/Hameentie-77-sisapiha.jpg"
    );
    instance.addProperty(
      web3.utils.toWei("0.002"),
      "Mannerheimintie 30 A",
      "Duplex with a really bad view",
      "https://google.com",
      "https://www.finna.fi/Cover/Show?id=hkm.HKMS000005%3Akm002zsb&index=0&size=large&source=Solr"
    );
  });

  /**
   * Checks that the contract inherits OpenZeppelin Ownable by using owner()
   */
  it("should add first account as owner using OpenZeppelin Ownable", async () => {
    assert.strictEqual(await instance.owner(), owner);
  });
  /*
  describe("addAsTenant()", () => {
    it("should check that property is vacant before adding tenant", async () => {
      assert.strictEqual(true, false);
    });
  });
  */
});
