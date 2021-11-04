import { useEffect, useState } from "react";
//import { Data, getDynamicTokenData } from "../utils/web3calls";
import Image from 'next/image'
import { createUser } from "../utils/web3";
import { Spinner } from 'reactstrap';

const LIST_COUNTRY = [
    'Italy',
    'Germany',
    'United Kingdom',
    'France',
    'Spain',
    'USA'
]

type Props = {
    address: string;
    onClose: () => void;
    onSubmit: () => void;
}

const Modal = (props: Props) => {

    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const createNewUser = async() => {
        if(!country){
            setError('❌ No country selected ❌')
        } else {
            setLoading(true);
            try{
                await createUser(props.address, country);
                setLoading(false);
                setMessage('User created! Lets go to your dashboard...')
            } catch(err) {
                console.log(err);
                setError('Error on creating new user! Try later...')
            }
            await createUser(props.address, country);
            props.onSubmit();
        }
    }

    const changeSelectedCountry = async (value: string): Promise<void> => {
        console.log(country)
        console.log(value);
        setCountry(value);
    }

    const setInfo = (e: any) => {
        console.log(e);
    }

    return(
        <>
        <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="w-3/2 sm:w-11/12 xs:w-11/12 max-h-screen mx-auto border border-yellow-500 p-5 absolute my-auto rounded-xl shadow-lg  bg-white overflow-auto">
                <div className="">
                    <div className="">
                        <h1 className="font-bold text-xl">SignUp to Web3Documents</h1>
                    </div>
                    <div className="my-6">
                        <label className="block mt-1 font-semibold text-lg xs:text-lg">Address</label>
                        <input type="text" placeholder="Username" id="usernameCheck" value={props.address} readOnly className="w-full h-4 px-2 py-6 border mt-auto mb-4 shadow-md hover:outline-none focus:outline-none focus:ring-1 focus:ring-primary-900 rounded-md"></input>
                        <label htmlFor="select-country" className="block mt-1 font-semibold text-lg xs:text-lg">Country</label>
                        <select name="select-country" required value={country} onChange={(e) => {changeSelectedCountry(e.target.value)}} id="select-coutry" className="w-full h-10 px-2 py-2 border mt-auto shadow-md hover:outline-none focus:outline-none focus:ring-1 focus:ring-primary-900 rounded-md">
                            <option value="#" disabled>Select country</option>
                            {LIST_COUNTRY.map((value, i)=>{
                                return <option value={value} key={i} onClick={(e)=>{setInfo(e)}}>{value}</option>
                            })}
                        </select>
                    </div>
                    {error? <p className="text-red-700 text-center">{error}</p> : null}
                    {message? <p className="text-green-700 text-center">{message}</p> : null}
                    <div className="p-3 mt-2 text-center space-x-4 md:block">
                        {loading? (
                            <div className="flex justify-center items-baseline">
                                <Spinner style={{color: "#01f982"}}/>
                            </div>
                        ) : (
                        <>
                            <button onClick={props.onClose} className="mb-2 md:mb-0 bg-white px-10 py-3 text-sm shadow-sm font-medium tracking-wider border rounded-xl hover:shadow-lg hover:bg-gray-100">
                                Close
                            </button>
                            <button onClick={createNewUser} style={{backgroundColor: '#01f982'}} className="mb-2 md:mb-0 px-10 py-3 text-sm shadow-sm font-medium tracking-wider border rounded-xl hover:shadow-lg">
                                SignUp
                            </button>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default Modal;