// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UserData is ERC721, ERC721URIStorage, Ownable {
    
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _usersIdCounter;
    
    mapping(uint256=>User) public _users;
    mapping(uint256=>uint256[]) private _userDocumentIds;
    mapping(uint256=>string[]) private dynamicData;
    
    constructor() ERC721("Document", "DOCS") {}
    
    struct User {
      address userAddress;
      string country;
      bool passport;
      bool personalId;
      bool taxCode;
    }
    
    event UserCreated(address _userAddress);
    event DocumentCreated(address _userAddress, uint256 tokenId);
    
    modifier onlyTokenOwner(uint256 _tokenId){
        require(ownerOf(_tokenId)==msg.sender, "Sender is not the owner of the token");
        _;
    }
    
    modifier onlyUser(uint256 _userId){
        require(_userId<_usersIdCounter.current(), "User not found! Create one!");
        require(_users[_userId].userAddress == msg.sender, "Only User can create his/her document!");
        _;
    }
    
    function createUser(address _to, string memory _country) external {
        _users[_usersIdCounter.current()]=User({
            userAddress: _to,
            country: _country,
            passport: false,
            personalId: false,
            taxCode: false
        });
        _usersIdCounter.increment();
        emit UserCreated(_to);
    }
    
    function onDocumentCreation(uint256 _userId, uint256 _typeOfRequest, string memory _uri) public onlyUser(_userId) {
        if(_typeOfRequest == 0) require(!(_users[_userId].passport), "User already have a passport");
        if(_typeOfRequest == 1) require(!(_users[_userId].personalId), "User already have an ID");
        if(_typeOfRequest == 2) require(!(_users[_userId].taxCode), "User already have a tax code");
        
        if(_typeOfRequest == 0) _users[_userId].passport = true;
        if(_typeOfRequest == 1) _users[_userId].personalId = true;
        if(_typeOfRequest == 2) _users[_userId].taxCode = true;

        _userDocumentIds[_userId].push(_tokenIdCounter.current());
                
        safeMint(_users[_userId].userAddress, _uri);

        emit DocumentCreated(_users[_userId].userAddress, _tokenIdCounter.current()-1);        
    }

    function safeMint(address to, string memory _uri) private {
        _safeMint(to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), _uri);
        _tokenIdCounter.increment();
    }

    // The following functions are overrides required by Solidity.
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Add a DynamicData to the array of a specific 'tokenId'.
     *
     * Tokens dynamicData can only be managed by the owner of that token.
     *
     * DynamicData can only be pushed into the array and not popped. 
     * Check first if the token exists and then add data. 
     */
    function addDataToDynamicNFT(uint256 _tokenId, string memory _data) public onlyTokenOwner(_tokenId) {
        require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
        dynamicData[_tokenId].push(_data);
    }
    
    /**
     * @dev Returns the DynamicData of a specific 'tokenId'.
     *
     * Tokens dynamicData can be seen by everybody in order to make it a standard for marketplace.
     * 
     * Check first if the token exists and then return the dynamicData. 
     */
    function getDynamiData(uint256 _tokenId) external view returns(string[] memory) {
        require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
        return dynamicData[_tokenId];
    }
    
    /**
     * @dev Returns the current tokenId counter.
     */
    function getTokenIdsCount() external view returns(uint256) {
        return _tokenIdCounter.current();
    }
    
    function getUserIdsCount() external view returns(uint256) {
        return _usersIdCounter.current();
    }
}