import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useMoralis } from 'react-moralis';
import Card from '../components/Card'

const Dashboard: NextPage = () => {

  const { authenticate, isAuthenticated, user} = useMoralis();
  const router = useRouter();

  return (
    <div className="w-screen h-screen">
      <h1 className="p-10 text-4xl font-bold">Dashboard</h1>
      <div className="p-10 flex justify-around items-center sm:flex-col xs:flex-col">
          <Card 
            color="#000000"
            uri=""
          />
          <Card 
            color="#F43100"
            uri=""
          />
          <Card 
            color="#012345"
            uri=""
          />
      </div>
    </div>
  )
}

export default Dashboard
