// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

contract UserDocument is ERC721, ERC721URIStorage, Ownable {
    
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _usersIdCounter;
    
    //list of users indexed by user_id
    mapping(uint256=>User) public _users;

    //array of userDocumentsIds indexed by user_id 
    mapping(uint256=>uint256[]) private _userDocumentIds;

    //array of url for the dynamic data of a specific token, indexed by token_id
    mapping(uint256=>string[]) private dynamicData;
    
    constructor() ERC721("Document", "DOCS") {}

    //STRUCT
    
    //the user struct has 2 main data that are userAddress and the country of residence
    //the user has also 3 boolean variables that help the frontend to display the data
    struct User {
      address userAddress;
      string country;
      bool passport;
      bool personalId;
      bool taxCode;
    }
    
    //EVENT

    event UserCreated(address _userAddress);
    event DocumentCreated(address _userAddress, uint256 tokenId);

    //MODIFIER
    
    modifier onlyTokenOwner(uint256 _tokenId){
        require(ownerOf(_tokenId)==msg.sender, "Sender is not the owner of the token");
        _;
    }
    
    modifier onlyUser(uint256 _userId){
        require(_userId<_usersIdCounter.current(), "User not found! Create one!");
        require(_users[_userId].userAddress == msg.sender, "Only User can create his/her document!");
        _;
    }
    
    /**
     * @dev create a new user and emit an event
     * @param _to the user address 
     * @param _country the country of residence of that user
     */
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
    
    /**
     * @dev create a new document / token
     * @param _userId the userId of the user that wants to create a new document
     * @param _typeOfRequest the type of document the user wants to create (0=passport, 1=personalId and 2=taxCode) coming from the frontend
     * @param _uri the metadata for the new document coming from the IPFS
     */
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

    /**
     * @dev create a new token and assign it to the user (override)
     * @param to address of the user to assign the token
     * @param _uri the metadata for the new document coming from the IPFS
     */
    function safeMint(address to, string memory _uri) private {
        _safeMint(to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), _uri);
        _tokenIdCounter.increment();
    }

    // The following functions are overrides required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev return the tokenURI of a specific token
     * @param tokenId the token_id of token to receive the URI
     */
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
     * @param _tokenId the token_id to get the corresponding dynamic data
     * @param _data the check to add at the dynamic data
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
     * @param _tokenId the token_id to get the corresponding dynamic data
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
    
    /**
     * @dev Returns the current userId counter.
     */
    function getUserIdsCount() external view returns(uint256) {
        return _usersIdCounter.current();
    }
}