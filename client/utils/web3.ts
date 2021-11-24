import Web3 from 'web3';
const USER_DATA = require('./UserData.json');
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0966e1283dc44663b2866ce92f1d5ab6'))
var account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY as string);
web3.eth.accounts.wallet.add(account);

const user_data = new web3.eth.Contract(
    USER_DATA,
    "0x3B34Aa79fee6297aCa9ee657e9A58Bff5A095C42"
);

type UserReturned = {
    userAddress: string;
    country: string;
    passport: number;
    personalId: number;
    taxCode: number;
}

export type User = {
    id: number;
    userAddress: string;
    country: string;
    passport: number;
    personalId: number;
    taxCode: number;
}

export const isUserRegistered = async(address: string) => {
    let counter: number = await user_data.methods.getUserIdsCount().call({ from: account.address});
    if(counter == 0) return false;
    for(let i=0; i<counter; i++){
        let user:UserReturned = await user_data.methods._users(i).call();
        if(user.userAddress.toLowerCase() == address){
            let userToReturn: User = {
                id: i,
                userAddress: user.userAddress,
                country: user.country,
                passport: user.passport,
                personalId: user.personalId,
                taxCode: user.taxCode
            }
            return userToReturn;
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

export const getUri = async(token_id: number) => {
    let response: string = await user_data.methods.tokenURI(token_id).call({from: account.address});
    return response;
}

export const getOwner = async(token_id: number) => {
    return user_data.methods.ownerOf(token_id).call({from: account.address});
}

export const getDynamicTokenData = async(id:number) => {
    const response:string[] = await user_data.methods.getDynamiData(id).call({from: account.address});
    return response;
}

export const addDynamicTokenData = async(id:string, uri: string) => {
    try{
        await user_data.methods.addDataToDynamicNFT(id, uri).send({from: account.address, gas: 500000});
    } catch(err) {
        console.log(err)
    }
    return;
}