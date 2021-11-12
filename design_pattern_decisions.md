# Design Pattern Decisions

## Early failures with modifier revert
Modifiers like onlyTokenOwner() were used properly to track failures early and revert() was effectively used to stop operations early

## Access Control Design Pattern
Access controll design pattern has been used in order to make the contract ownable by the deployer and in order to use it in case of different needs of the platform (like to centralized controll over the addition of dynamic data). 

## Access Restriction
Many of the contract state variables (_tokenIdCounter, _userIdCounter, _userDocumentIds and dynamicData) are privately accessible to the contract. Certain function like add new dynamicData or create a new Docuemnt can only be performed by a specific token.

## Integer Overflow and Underflow (SWC-101)
Variable types and max-length were carefully chosen and the library ``SafeMath.sol`` was used to handle integer overflow and underflow exceptions and errors. For the token and users id counter the library ``Counters.sol`` was used in order to have a build in controll over ids and follow the design of the ``ERC721.sol`` contract.