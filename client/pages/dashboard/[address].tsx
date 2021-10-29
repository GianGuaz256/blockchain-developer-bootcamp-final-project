import type { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import Card from '../../components/Card'
import { getUri, isUserRegistered, User } from '../../utils/web3';
import axios from 'axios'
import getConfig from 'next/config';
import { JSONBodyRequest } from '../../utils/ipfs';
const { publicRuntimeConfig } = getConfig();

type Props = {
    user: User;
    taxInfo: JSONBodyRequest;
    passInfo: JSONBodyRequest;
    personalInfo: JSONBodyRequest;
}

const Dashboard = (props: Props) => {

  const { isAuthenticated, user} = useMoralis();
  const router = useRouter();

  useEffect(()=>{
    //
  }, [user])

  const format = (address: string) => {
    const first = address.slice(0, 4);
    const last = address.slice(38, 42);
    return first + '...' + last
  }

  return (
    <div className="w-screen h-screen">
      <h1 className="p-6 text-4xl font-bold">Dashboard 👋</h1>
      <div className="w-auto border shadow-md m-4 rounded-lg p-6 font-bold text-lg">
        <h2 className="p-2">User Address: {format(props.user.userAddress)}</h2>
        <h2 className="p-2">User Country: {props.user.country}</h2>
        <h2 className="p-2">Smart Contract Address: {format(process.env.CONTRACT_ADDRESS as string)}</h2>
      </div>
      <div className="p-6 flex justify-around items-center flex-wrap sm:flex-col xs:flex-col">
          <div className="flex-col justify-around items-center m-4">
            <h1 className="text-center font-bold text-xl">Passport</h1>
            <Card 
              color="#f98080"
              uri={props.passInfo}
              activated={props.user.passport}
              idRequest={0}
            />
          </div>
          <div className="flex-col justify-around items-center p-4">
            <h1 className="text-center font-bold text-xl">Personal ID</h1>
            <Card 
              color="#93d4ff"
              uri={props.personalInfo}
              activated={props.user.personalId}
              idRequest={1}
            />
          </div>
          <div className="flex-col justify-around items-center p-4">
            <h1 className="text-center font-bold text-xl">Taxcode</h1>
            <Card 
              color="#89de9a"
              uri={props.taxInfo}
              activated={props.user.taxCode}
              idRequest={2}
            />
          </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
    
    const address = context.query.address;

    const response = await isUserRegistered(address as string);

    let taxInfo!: JSONBodyRequest;
    let passInfo!: JSONBodyRequest;
    let personalInfo!: JSONBodyRequest;

    const emptyJSON: JSONBodyRequest = {
        name: '',
        description: '',
        image: '',
        attributes: []
    }

    if(response){
        if(response.passport!=0){
            const resultString: string = await getUri(response.passport);
            const result = await axios.get(resultString).then(res=>{return res.data as JSONBodyRequest});
            passInfo = result
        } else {
            passInfo = emptyJSON
        }
    
        if(response.personalId!=0){
            const resultString: string = await getUri(response.personalId);
            const result = await axios.get(resultString).then(res=>{return res.data as JSONBodyRequest});
            personalInfo = result
        } else {
            personalInfo = emptyJSON
        }
    
        if(response.taxCode!=0){
            const resultString: string = await getUri(response.taxCode);
            const result = await axios.get(resultString).then(res=>{return res.data as JSONBodyRequest});
            taxInfo = result
        } else {
            taxInfo = emptyJSON
        }

    } else {
        return {
            props: {
                user: response
            }
        }
    }    

    return {
      props: {
        user: response,
        passInfo,
        personalInfo,
        taxInfo
      }, 
    }
}

export default Dashboard
