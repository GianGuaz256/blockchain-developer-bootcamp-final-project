const UserDocument = artifacts.require("UserDocument");
const catchRevert = require("./exceptionsHelpers.js").catchRevert;

contract("UserDocument", function (accounts) {

  let contract;
  const owner = accounts[0];
  const user_1 = accounts[1];
  const URI = 'https://gateway.pinata.cloud/ipfs/QmXZyykAuU84nsaKaCMYvgW34pHpwsDyDcrcmcRNmnFHuJ';

  beforeEach(async () => {
    contract = await UserDocument.new({from: owner});
    await contract.createUser(user_1, "Italy");
  });

  it("should check owner account as minter", async () => {
    let minter = await contract.owner();
    assert.equal(
    minter,
    owner,
    "Owner Account is not the minter"
    );
  });

  it("Should create a new user with parameters setup", async () =>{
    const user_ids = await contract.getUserIdsCount();
    assert.equal(user_ids, 1);
    const user = await contract._users(0);
    const userAddress = user.userAddress;
    const country = user.country;
    assert.equal(userAddress, user_1);
    assert.equal(country, "Italy");
  });

  it("Should create a new Passport Token and check if it's in the user profile", async () =>{
    await contract.onDocumentCreation(0, 0, URI, {from: user_1});
    const tokenCount = await contract.getTokenIdsCount();
    assert.equal(tokenCount, 1);
    const user = await contract._users(0);
    assert.equal(user.passport, true);
  });

  it("Should create a document and add checks on it", async () =>{
    await contract.onDocumentCreation(0, 0, URI, {from: user_1});
    await contract.addDataToDynamicNFT(0, URI, {from: user_1});
    await contract.addDataToDynamicNFT(0, URI, {from: user_1});
    const tokenData = await contract.getDynamiData(0);
    assert.equal(tokenData.length, 2);
  });

  it("Should revert if not the owner try to add a change", async () =>{
    await contract.onDocumentCreation(0, 0, URI, {from: user_1});
    await catchRevert(contract.addDataToDynamicNFT(0, URI));
  });

  it("Should revert if is not the user that create a new document", async () =>{
    await catchRevert(contract.onDocumentCreation(0, 0, URI));
  });

  it("Should get the exact URI once added to the token", async () =>{
    await contract.onDocumentCreation(0, 0, URI, {from: user_1});
    await contract.addDataToDynamicNFT(0, URI, {from: user_1});
    await contract.addDataToDynamicNFT(0, URI, {from: user_1});
    const tokenData = await contract.getDynamiData(0);
    assert.equal(tokenData[0], URI)
  });

  it("Should revert if the user tries to add data to a non existing token", async () =>{
    await catchRevert(contract.addDataToDynamicNFT(2, URI));
  });

  it("Should return the right token URI", async () =>{
    await contract.onDocumentCreation(0, 0, URI, {from: user_1});
    const tokenData = await contract.tokenURI(0);
    assert.equal(tokenData, URI)
  });

  it("Should revert if user do not exist", async () =>{
    await catchRevert(contract.onDocumentCreation(2, 0, URI, {from: user_1}))
  });

});