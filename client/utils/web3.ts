import Web3 from 'web3';
const USER_DATA = require('./UserData.json');
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

var web3 = new Web3("https://speedy-nodes-nyc.moralis.io/edf14b3c8fe88e8b338bfc47/polygon/mainnet");
var account = web3.eth.accounts.privateKeyToAccount(publicRuntimeConfig.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const user_data = new web3.eth.Contract(
    USER_DATA,
    publicRuntimeConfig.CONTRACT_ADDRESS
);

export type User = {
    userAddress: string;
    country: string;
    passport: boolean;
    personalId: boolean;
    taxCode: boolean;
}

export const isUserRegistered = async(address: string) => {
    let counter: number = await user_data.methods.getUserIdsCount().call({ from: account.address});
    console.log(counter)
    if(counter == 0) return false;
    for(let i=0; i<counter; i++){
        let user:User = await user_data.methods._users(i).call();
        console.log(user);
        if(user.userAddress.toLowerCase() == address){
            return user;
        }
    }
    return false;
}

export const numOfToken = async() => {
    return await user_data.methods.getTokenIdsCount().call({from: account.address});
}

export const createUser = async(address: string, country: string) => {
    await user_data.methods.createUser(address, country).send({from: account.address, gas: 500000});
    return;
}

export const createDocument = async(id_user: number, request: number, uri: string) => {
    return user_data.methods.onDocumentCreation(0, request, uri).send({from: account.address, gas: 500000});
}

/*export const mintNewToken = async(address: string, uri: string) => {
    try {
        let status = await dynamicNFT.methods.safeMint(address, uri).send({from: account.address, gas: 500000})
        return status;
    } catch(err) {
        console.log(err)
        return false;
    }
}

export type Data = {
    id: string;
    uri: string;
}

export const getTokenOfOwnerData = async(address:string) => {
    let counter = await dynamicNFT.methods.getTokenIdsCount().call({ from: account.address});
    let tokens:number = await dynamicNFT.methods.balanceOf(address).call();
    let data: Data[] = [];
    for(let i=1; i<counter || data.length==tokens; i++){
        let owner:string = await dynamicNFT.methods.ownerOf(i).call()
        if(owner.toLocaleLowerCase() == address){
            let tmp = await dynamicNFT.methods.tokenURI(i).call();
            let objTmp = {
                id: i.toString(),
                uri: tmp
            }
            data.push(objTmp);
        }
    }
    return data;
}

export const getNumberOfTokenOwned = async(address:string) => {
    return await dynamicNFT.methods.balanceOf(address).call();
}

export const getDynamicTokenData = async(id:string) => {
    return await dynamicNFT.methods.getDynamiData(id).call({from: account.address});
}

export const addDynamicTokenData = async(id:string, uri: string) => {
    try{
        await dynamicNFT.methods.addDataToDynamicNFT(id, uri).send({from: account.address, gas: 500000});
    } catch(err) {
        console.log(err)
    }
    return;
}*/