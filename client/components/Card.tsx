import { useEffect, useState } from "react"
import ModalUse from './ModalUse'
import ModalCreate from './ModalCreate'
import ModalUsage from './ModalUsage';
import axios from 'axios';
import { JSONBodyRequest } from "../utils/ipfs";
import {Spinner} from 'reactstrap'

type Props = {
    color: string;
    uri: JSONBodyRequest;
    activated: number;
    idRequest: number;
}

const emptyJSON: JSONBodyRequest = {
    name: '',
    description: '',
    image: '',
    attributes: []
}

const Card = (props: Props) => {

    const [modalUse, setModalUse] = useState(false);
    const [modalUsage, setModalUsage] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<JSONBodyRequest>();

    useEffect(()=>{
        console.log(props.uri);
    }, [])

    const createDocument = async() => {
        window.location.reload();
    }

    return (
        <>
        {modalCreate? (
            <div className="fixed z-50">
                <ModalCreate
                    typeOfRequest={props.idRequest}
                    onClose={()=>setModalCreate(false)}
                    onSubmit={()=>{createDocument()}}
                />
            </div>
        ) : null}
        {modalUse? (
            <div className="fixed z-50">
                <ModalUse
                    tokenId={props.activated}
                    onClose={()=>setModalUse(false)}
                />
            </div>
        ) : null}
        {modalUsage? (
            <div className="fixed z-50">
                <ModalUsage
                    tokenId={props.activated}
                    onClose={()=>setModalUsage(false)}
                />
            </div>
        ) : null}
        <div className="flex-col justify-between items-center">
            <a onClick={()=>{console.log('Clicked')}} className="cursor-pointer">
                <div className="h-48 w-80 rounded-lg m-10" style={{backgroundColor: `${props.color}`}}>
                        {props.uri != emptyJSON? (
                        <div className="w-full h-full p-3">
                            {props.uri.attributes.map((attribute, index)=>{
                                return <h2 key={index} className="py-2"><strong>{attribute.value}</strong>: {attribute.trait_type}</h2>
                            })}
                        </div>
                    ) : null}
                </div>
            </a>   
            <div className="w-full flex justify-around items-center">
                {props.activated != 0 ? (
                    <>
                        <button style={{backgroundColor: '#01f982'}} onClick={()=>{setModalUsage(true)}} className="hover:bg-blue-700 text-black mb-2 md:mb-0 px-8 py-2 text-lg shadow font-medium tracking-wider border rounded-xl hover:shadow-lg">Usage</button>
                        <button style={{backgroundColor: '#01f982'}} onClick={()=>{setModalUse(true)}} className="hover:bg-blue-700 text-black mb-2 md:mb-0 px-8 py-2 text-lg shadow font-medium tracking-wider border rounded-xl hover:shadow-lg">Use</button>
                    </>
                ) : (
                    <button style={{backgroundColor: '#01f982'}} onClick={()=>{setModalCreate(true)}} className="hover:bg-blue-700 text-black mb-2 md:mb-0 px-8 py-2 text-lg shadow font-medium tracking-wider border rounded-xl hover:shadow-lg">Create</button>
                )}
            </div>         
        </div>
        </>
    )
}

export default Card;