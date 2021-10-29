import type { NextPage, NextPageContext } from 'next'
import { useEffect, useState } from 'react';
import { addDynamicTokenData, getDynamicTokenData, getOwner, getUri } from '../../utils/web3';
import axios from 'axios';
import { Spinner } from 'reactstrap';
import { pinJSONToIPFS, pinJSONToIPFSData } from '../../utils/ipfs';

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
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [state, setState] = useState({
    error: '',
    success: ''
  });

  const {success, error} = state;

  useEffect(()=>{
    getOwnerOfToken();
    getLocation();
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

  const getLocation = () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position=>{
        console.log(position.coords)
        setLocation(position.coords);
      });
    }
  }

  const confirmCheck = async() => {
    console.log("Submitting check...");
    setLoading(true);
    let ipfsHash;
    const data = await getDynamicTokenData(props.id);
    try {
      ipfsHash = await pinJSONToIPFSData({
        name: `Check #${data.length}`,
        geolocation: location,
        time: new Date(),
      });
      console.log('Pinned JSON Data to IPFS...')
      await addDynamicTokenData(props.id.toString(), "https://gateway.pinata.cloud/ipfs/" + ipfsHash);
      console.log('Done!')
      setLoading(false);
      setState({
        ...state,
        success: 'Check completed! ✔'
      })
    } catch(err){
      console.log(err);
      setState({
        ...state,
        error: 'An error occurred! Try again 😕'
      })
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
        <div className="rounded-lg flex-col text-center p-2 m-4">
            <h1 className="text-3xl font-bold">Token of {format(owner)}</h1>
            {props.response.attributes.map((attribute, index)=>{
                return (
                  <div key={index} className="p-2">
                      <h2 className="my-2 text-xl font-semibold">{attribute.value}:</h2>
                      <h2 className="">{attribute.trait_type}</h2>
                  </div>
                )
            })}
            <div className="flex justify-center items-center p-6">
              {loading? (
                <div className="flex justify-center items-baseline">
                  <Spinner style={{color: "#01f982"}}/>
                </div>
              ): (
                <button className="my-6 px-10 py-3 text-lg rounded-lg shadow-md hover:shadow-xl" style={{backgroundColor: '#01f982'}} onClick={()=>{confirmCheck()}}>Confirm</button>
              )}
            </div>
            <div>
              {success ? <p className="text-green-700 text-center mb-2">{success}</p> : null} 
              {error ? <p className="text-red-700 text-center mb-2">{error}</p> : null} 
            </div>
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
