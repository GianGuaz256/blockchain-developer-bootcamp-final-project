# Non-fungible Document

ETH Address: 0xe861D3c3eA8dEF3AE4191E13A05D7dC302033024

<img src="../assets/dashboard.png" alt="Dashboard" title="The Dashboard" width="600"/>

## Overview
This is the final delivery for the Consensys 2021 course. The purpose of the application is to create a portal for the creation of documents in the form of Non Fungible Tokens. These tokens have been developed using the ERC721 standard by modifying some parts to make them dynamic.

## Technologies used 
The technologies used for this application are:
- IPFS, for saving metadata related to documents and "checks",
- Polygon, as main chain for the deployment of the contract,
- Solidity, for the development of the Smart contract,
- Web3.js, for the connection of the frontend to the contract interface,
- Moralis, for the authentication of the user to the Dapp,
- Nextjs, for frontend development.

## Smart contract 
The Dapp consists of a single contract that defines all interactions with the web app. It was developed using the ERC721 standard for NFTs with the extension for the URI and the possibility of being Ownable. Within the contract we find the logic that manages users and their enrollment in the Dapp. The user is defined with this schema:

```
struct User {
    address userAddress;
    string country;
    bool passport;
    bool personalId;
    bool taxCode;
}
```

NFTs come into play in defining documents and creating them. Each user has the ability to create three documents: TaxCode, Passport, and ID. Each of these documents takes in input data that will be saved in the IPFS and will be shown in the dashboard for later use. 

The ERC721 standard has been modified to make each document dynamic and therefore be able to save multiple URIs within it. An array of strings has been defined which are mapped to the tokenID and are updated by adding an element at the end. 

```
Counters.Counter private _tokenIdCounter;
mapping(uint256=>uint256[]) private _userDocumentIds;
mapping(uint256=>string[]) private dynamicData;

function addDataToDynamicNFT(uint256 _tokenId, string memory _data) public onlyTokenOwner(_tokenId) {
    require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
    dynamicData[_tokenId].push(_data);
}

function getDynamiData(uint256 _tokenId) external view returns(string[] memory) {
    require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
    return dynamicData[_tokenId];
}
```

## Frontend 
The frontend has been developed with Next.js and is composed of 3 screens: 

- Login Page
- Dashboard
- Add Check.

The login page is used to understand if the user is already registered or not. If not, a modal is created that allows you to enter the country of belonging. The Dashboard allows to create a new document, to use it through a QR Code or to see which and how many checks have been done. Creating a document actually mints an NFT with the characteristics entered by the user. Using the document a QR Code is created that allows an external user to open an external page in order to see the data of the document and to complete the Check.

<img src="../assets/login.png" alt="Login" title="The Login" width="600"/>

The check consists of two parts which are the date and place of the check. When an external user wants to make a check on the documents, this information will be saved on the IPFS so that the owner can check the actual check. On the user mode the holder will be presented with the list of performed checks. 


<img src="../assets/check.png" alt="Check" title="The Operator Check" width="400"/>


## Idea behind the PoC 
The general idea is to create a PoC able to test the use of NFT within the world of public administration. Clearly this project is meant to run on the Ethereum Blockchain and IPFS thus keeping the data transparent to anyone. The user of the Dapp should be the citizen and the check should be done by the control bodies such as the police etc..

## To run the application

In order to run the application in the local environment you need to follow these steps:
1) Install node modules
```
cd client/
```

```
npm install
```
2) Run locally

```
npm run dev
```

## To run the smart contract and test

In order to run the Smart Contract test in the local environment you need to follow these steps:
1) Install node modules (and openzeppelin contracts repo)

```
npm install
```
2) Run test

```
truffle test
```