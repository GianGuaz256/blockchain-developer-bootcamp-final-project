import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import Card from '../components/Card'
import { isUserRegistered, User } from '../utils/web3';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const Dashboard: NextPage = () => {

  const { isAuthenticated, user} = useMoralis();
  const router = useRouter();
  
  const [userData, setUserData] = useState<User>({
    userAddress: '',
    country: '',
    passport: false,
    personalId: false,
    taxCode: false
  });

  useEffect(()=>{
    if(user){
      getUserData();
    } else{
      //What to do?
    }
  }, [user])

  const getUserData = async() => {
    const response = await isUserRegistered(user?.get('ethAddress'));
    if(response) setUserData(response);
  }

  const format = (address: string) => {
    const first = address.slice(0, 4);
    const last = address.slice(38, 42);
    return first + '...' + last
  }

  return (
    <div className="w-screen h-screen">
      <h1 className="p-6 text-4xl font-bold">Dashboard</h1>
      <div className="w-auto border shadow-md m-4 rounded-lg p-6 font-bold text-lg">
        <h2 className="p-2">User Address: {format(userData.userAddress)}</h2>
        <h2 className="p-2">User Country: {userData.country}</h2>
        <h2 className="p-2">Smart Contract Address: {format(publicRuntimeConfig.CONTRACT_ADDRESS)}</h2>
      </div>
      <div className="p-6 flex justify-around items-center sm:flex-col xs:flex-col">
          <div className="flex-col justify-around items-center p-4">
            <h1 className="text-center font-bold text-xl">Passport</h1>
            <Card 
              color="#000000"
              uri=""
              activated={userData.passport}
              idRequest={0}
            />
          </div>
          <div className="flex-col justify-around items-center p-4">
            <h1 className="text-center font-bold text-xl">Personal ID</h1>
            <Card 
              color="#F43100"
              uri=""
              activated={userData.personalId}
              idRequest={1}
            />
          </div>
          <div className="flex-col justify-around items-center p-4">
            <h1 className="text-center font-bold text-xl">Taxcode</h1>
            <Card 
              color="#012345"
              uri=""
              activated={userData.taxCode}
              idRequest={2}
            />
          </div>
      </div>
    </div>
  )
}

export default Dashboard
