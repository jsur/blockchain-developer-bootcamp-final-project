const Rentals = artifacts.require("./Rentals.sol");

module.exports = function (deployer) {
  deployer.deploy(Rentals);
};
