import type { NextPage, NextPageContext } from 'next'
import { useEffect, useState } from 'react';
import { getOwner, getUri } from '../../utils/web3';
import axios from 'axios';

type Attributes = {
    trait_type: string;
    value: string;
}

type TokenInfo = {
    title: string;
    description: string;
    image: string;
    attributes: Attributes[];
}

type Props = {
    id: number;
    response: TokenInfo;
}

const InfoPage = (props: Props) => {

  const [owner, setOwner] = useState('');

  useEffect(()=>{
    getOwnerOfToken();
  }, [])

  const getOwnerOfToken = async() => {
    const address = await getOwner(props.id);
    setOwner(address);
  }

  const format = (address: string) => {
    const first = address.slice(0, 4);
    const last = address.slice(38, 42);
    return first + '...' + last;
  }

  const confirmCheck = async() => {
      //
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
        <div className="rounded-lg flex-col text-center p-2 m-4">
            <h1 className="text-3xl font-bold">Token of {format(owner)}</h1>
            {props.response.attributes.map((attribute, index)=>{
                return (
                    <div className="p-2">
                        <h2 className="my-2 text-xl font-semibold">{attribute.value}:</h2>
                        <h2 className="">{attribute.trait_type}</h2>
                    </div>
                )
            })}
            <button className="my-6 px-10 py-3 text-lg rounded-lg shadow-md hover:shadow-xl" style={{backgroundColor: '#01f982'}} onClick={()=>{confirmCheck()}}>Confirm</button>
        </div>      
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
    
    let id: number = 0;
    if(context.query.id){
        id = parseInt(context.query.id as string);        
    } 
    const uri = await getUri(id);

    const response = await axios.get(uri).then((result)=>{
        return result.data;
    });

    return {
      props: {
        response,
        id
      }, 
    }
}
  

export default InfoPage;
