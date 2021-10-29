import { useEffect, useState } from "react";
//import { Data, getDynamicTokenData } from "../utils/web3calls";
import Image from 'next/image'
import { createUser, numOfToken, createDocument } from "../utils/web3";
import { Spinner } from 'reactstrap';
import { pinJSONToIPFS } from "../utils/ipfs";

const DOCUMENT_TYPES = [
    "Passport",
    "Personal ID",
    "Tax Code"
];

const DOCUMENT_DESCRIPTIOM = "This is a concept for using centralized documents in a decentralized environment such as web3. Possible studies could lead to the use of this form of documentation in DAOs.";

const IMAGE_HASH = "QmXZyykAuU84nsaKaCMYvgW34pHpwsDyDcrcmcRNmnFHuJ";

type Props = {
    typeOfRequest: number;
    onClose: () => void;
    onSubmit: () => void;
}

const Modal = (props: Props) => {

    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [values, setValues] = useState({
        documentNum: '',
        issuer: '',
        release: '',
        expiration: ''
    });

    const {documentNum, issuer, release, expiration} = values;
    
    useEffect(()=>{
        //
    }, [])

    const createNewDocument = async(e: any) => {
        e.preventDefault();
        if(documentNum && issuer && release && expiration){
          console.log("Submitting...");
          setLoading(true);
          // Upload files on IPFS
          let ipfsHash = "";
          const tokenNum = await numOfToken();
          try {
            ipfsHash = await pinJSONToIPFS({
              name: DOCUMENT_TYPES[props.typeOfRequest] + '#' + tokenNum,
              description: DOCUMENT_DESCRIPTIOM,
              image: "https://gateway.pinata.cloud/ipfs/" + IMAGE_HASH,
              attributes: [
                {
                    value: "Document Number",
                    trait_type: documentNum
                },
                {
                    value: "Issuer",
                    trait_type: issuer
                },
                {
                    value: "Release Date",
                    trait_type: release
                },
                {
                    value: "Expiration Date",
                    trait_type: expiration
                }
              ]
            });
            console.log('Pinned JSON to IPFS...')
            await createDocument(0, props.typeOfRequest, "https://gateway.pinata.cloud/ipfs/" + ipfsHash);
            console.log('Done!')
            setLoading(false);
            props.onClose();
            props.onSubmit();
          } catch (err) {
            console.log("Error Uploading files on IPFS", err);
            setLoading(false);
            setError("Error on creating new document!");
          }
        } else {
            setError('❌ Still missing some info ❌')
        }
    }

    const handleChange = (name: string, e: any) => {
        setValues({ 
            ...values,
            [name]: e.target.value });
    };

    return(
        <>
        <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="w-3/2 sm:w-11/12 xs:w-11/12 max-h-screen mx-auto border border-yellow-500 p-5 absolute my-auto rounded-xl shadow-lg  bg-white overflow-auto">
                <div className="">
                    <div className="">
                        <h1 className="font-bold text-xl">Create your {DOCUMENT_TYPES[props.typeOfRequest]}</h1>
                    </div>
                    <div className="my-6">
                        <label className="block mt-1 font-semibold text-lg xs:text-lg">Document number</label>
                        <input type="text" onChange={(e)=>{handleChange('documentNum', e)}} placeholder="IT1837432whd432" id="usernameCheck" value={documentNum} className="w-full h-4 px-2 py-6 border mt-auto mb-2 shadow-md hover:outline-none focus:outline-none focus:ring-1 focus:ring-primary-900 rounded-md"></input>
                        <label className="block mt-1 font-semibold text-lg xs:text-lg">Issuer</label>
                        <input type="text" onChange={(e)=>{handleChange('issuer', e)}} placeholder="City of London" id="usernameCheck" value={issuer} className="w-full h-4 px-2 py-6 border mt-auto mb-2 shadow-md hover:outline-none focus:outline-none focus:ring-1 focus:ring-primary-900 rounded-md"></input>
                        <label className="block mt-1 font-semibold text-lg xs:text-lg">Release Date</label>
                        <input type="text" onChange={(e)=>{handleChange('release', e)}} placeholder="25/10/2010" id="usernameCheck" value={release} className="w-full h-4 px-2 py-6 border mt-auto mb-2 shadow-md hover:outline-none focus:outline-none focus:ring-1 focus:ring-primary-900 rounded-md"></input>
                        {/*<DatePicker className="w-full h-4 px-2 py-6 border mt-auto mb-2 shadow-md hover:outline-none focus:outline-none focus:ring-1 focus:ring-primary-900 rounded-md" selected={startDate} onChange={(date: Date) => setStartDate(date)} />*/}
                        <label className="block mt-1 font-semibold text-lg xs:text-lg">Expiration Date</label>
                        <input type="text" onChange={(e)=>{handleChange('expiration', e)}} placeholder="25/10/2030" id="usernameCheck" value={expiration} className="w-full h-4 px-2 py-6 border mt-auto mb-2 shadow-md hover:outline-none focus:outline-none focus:ring-1 focus:ring-primary-900 rounded-md"></input>       
                    </div>
                    {error? <p className="text-red-700 text-center mb-2">{error}</p> : null}
                    <div className="mt-2 text-center space-x-4 md:block">
                        {loading? (
                            <div className="flex justify-center items-baseline">
                                <Spinner style={{color: "#3BAEA7"}}/>
                            </div>
                        ) : (
                            <div className="flex justify-around items-center">
                                <button onClick={props.onClose} className="mb-2 md:mb-0 bg-white px-10 py-4 text-sm shadow-sm font-medium tracking-wider border rounded-xl hover:shadow-lg hover:bg-gray-100">
                                    Close
                                </button>
                                <button onClick={(e)=>{createNewDocument(e)}} style={{backgroundColor: '#01f982'}} className="mb-2 md:mb-0 px-10 py-4 text-sm shadow-sm font-medium tracking-wider border rounded-xl hover:shadow-lg">
                                    Create
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default Modal;