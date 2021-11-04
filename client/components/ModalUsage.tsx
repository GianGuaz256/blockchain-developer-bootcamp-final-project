import { useEffect, useState } from "react";
import { createUser, getDynamicTokenData } from "../utils/web3";
import { Spinner } from 'reactstrap';
import axios from 'axios';
import { JSONDataRequest } from "../utils/ipfs";

type Props = {
    tokenId: number;
    onClose: () => void;
}

const ModalUsage = (props: Props) => {

    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<JSONDataRequest[]>([]);
    const [error, setError] = useState('');
    
    useEffect(()=>{
        getTokenHistory();
    }, [])

    const getTokenHistory = async() => {
        setLoading(true);
        const dataToAdd = await getDynamicTokenData(props.tokenId);
        console.log(dataToAdd)
        //--------------------
        let infoToPush: JSONDataRequest[] = []
        for(var i=0; i<dataToAdd.length; i++){
            await axios.get(dataToAdd[i]).then(result=>{
                console.log(result.data)
                let response = result.data as JSONDataRequest;
                infoToPush.push(response);
            });
        }
        console.log(infoToPush);
        setInfo(infoToPush);
        setLoading(false);
    }

    return(
        <>
        <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="w-3/2 sm:w-11/12 xs:w-11/12 max-h-screen mx-auto border border-yellow-500 p-5 absolute my-auto rounded-xl shadow-lg  bg-white overflow-auto">
                <div className="">
                    <div className="">
                        <h1 className="font-bold text-xl text-center">List of checks</h1>
                    </div>
                    <div className="my-6">
                        {loading? (
                            <div className="flex justify-center items-baseline">
                                <Spinner style={{color: "#01f982"}}/>
                            </div>
                        ) : (
                            <div>
                                {info.map((obj, index)=>(
                                    <>
                                        <div key={index} className="p-4 my-2 border border-black rounded-2xl">
                                            <h1><strong>Check name:</strong> {obj.name}</h1>
                                            <h1><strong>Geolocation:</strong> None</h1>
                                            <h1><strong>Check date:</strong> {obj.time}</h1>
                                        </div>
                                    </>
                                ))}
                            </div>
                        )}
                    </div>
                    {error? <p className="text-red-700 text-center">{error}</p> : null}
                    <div className="p-3 mt-2 text-center space-x-4 md:block">
                        <button onClick={props.onClose} className="mb-2 md:mb-0 bg-white px-10 py-3 text-sm shadow-sm font-medium tracking-wider border rounded-xl hover:shadow-lg hover:bg-gray-100">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default ModalUsage;