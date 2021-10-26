import { useState } from "react"
import ModalUse from './ModalUse'
import ModalCreate from './ModalCreate'
import ModalUsage from './ModalUsage'

type Props = {
    color: string;
    uri: string | Promise<string>;
    activated: boolean;
    idRequest: number;
}

const Card = (props: Props) => {

    const [modalUse, setModalUse] = useState(false);
    const [modalUsage, setModalUsage] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);

    const createDocument = async() => {
        window.location.reload();
    }

    const onUse = () => {
        //
    }

    const onUsage = () => {
        //
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
                    onClose={()=>setModalUse(false)}
                    onSubmit={()=>{createDocument()}}
                />
            </div>
        ) : null}
        {modalUsage? (
            <div className="fixed z-50">
                <ModalUsage
                    onClose={()=>setModalUse(false)}
                    onSubmit={()=>{createDocument()}}
                />
            </div>
        ) : null}
        <div className="flex-col justify-between items-center">
            <a onClick={()=>{console.log('Clicked')}} className="cursor-pointer">
                <div className="w-64 h-48 rounded-lg m-10" style={{backgroundColor: `${props.color}`}}>

                </div>
            </a>   
            <div className="w-full flex justify-around items-center">
                {props.activated? (
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