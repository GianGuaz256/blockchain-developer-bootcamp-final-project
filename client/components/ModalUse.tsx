import { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const DOMAIN = "https://blockchain-developer-bootcamp-final-project-lemon.vercel.app";

type Props = {
    tokenId: number;
    onClose: () => void;
}

const ModalUse = (props: Props) => {

    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    
    useEffect(()=>{
        //
    }, [])

    return(
        <>
        <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="w-3/2 sm:w-11/12 xs:w-11/12 max-h-screen mx-auto border border-yellow-500 p-5 absolute my-auto rounded-xl shadow-lg  bg-white overflow-auto">
                <div className="">
                    <div className="">
                        <h1 className="font-bold text-xl text-center">Scan me!</h1>
                    </div>
                    <div className="flex w-full h-full justify-center items-center p-8">
                        <QRCode value={DOMAIN ? `${DOMAIN}/info/${props.tokenId}` : `http://localhost:3000/info/${props.tokenId}`} />
                    </div>
                    <div className="flex justify-center items-center p-4">
                        <button onClick={props.onClose} className="mx-auto mb-2 md:mb-0 bg-white px-10 py-3 text-sm shadow-sm font-medium tracking-wider border rounded-xl hover:shadow-lg hover:bg-gray-100">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ModalUse;