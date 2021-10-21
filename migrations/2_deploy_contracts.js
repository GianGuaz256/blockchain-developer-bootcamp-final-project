var UserDocument = artifacts.require("UserDocument");

module.exports = function(deployer) {
  deployer.deploy(UserDocument);
};