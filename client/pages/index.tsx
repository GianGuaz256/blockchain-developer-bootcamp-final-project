import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import Image from 'next/image'
import Metamask from '../public/metamask.png';
import WalletConIcon from '../public/wallet.png'
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { createUser, isUserRegistered } from '../utils/web3';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

// Create a connector
const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
  });

const Home: NextPage = () => {

  const router = useRouter();

  const [signupModal, setSignupModal] = useState(false);
  const [address, setAddress] = useState('');
  const [small, setSmall] = useState(false);

  useEffect(()=>{
    checkConnections();
    isMetamaskValid();
    window.addEventListener("resize", isMetamaskValid);
  }, [])

  const getInfo = async(addressReceived:string) => {
    const response = await isUserRegistered(addressReceived);

    if(!response){
        setSignupModal(true);
    } else {
        router.push(`/dashboard/${addressReceived}`);
    }
  }

  const isMetamaskValid = () =>{
        var w = window.innerWidth;
        if(w<=768){
            setSmall(true);
        } else {
            setSmall(false);
        }
    }

    const checkConnections = () => {
        if (connector.connected) {
            connector.on("disconnect", (error, payload) => {
                if (error) {
                    throw error;
                }
            });
        }
    }

    const authenticateWithMetamask = async() =>{
        // @ts-ignore: Unreachable code error
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (result)=>{
            // @ts-ignore: Unreachable code error
            setAddress(window.ethereum._state.accounts[0]);
            // @ts-ignore: Unreachable code error
            await getInfo(window.ethereum._state.accounts[0])
        })
    }

    const authenticateWithWalleCon = () =>{
        if (!connector.connected) {
            // create new session
            connector.createSession()
            //Sistemare on reject!
        }
        connector.on("connect", async(error, payload) => {
            if (error) {
                window.location.reload();
                throw error;
            }          
            // Get provided accounts and chainId
            const { accounts, chainId } = payload.params[0];
            setAddress(accounts);
            await getInfo(accounts)
            router.push('/signup');
        });
    }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="wave-up">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
      </div>
      {signupModal? (
            <div className="fixed z-50">
                <Modal 
                    address={address}
                    onClose={()=>setSignupModal(false)}
                    onSubmit={()=>{router.push(`/dashboard/${address}`)}}
                />
            </div>
        ) : null}
      <div className="w-full min-h-screen overflow-hidden flex justify-center items-center">
        <div className="w-auto h-auto shadow-lg rounded-lg flex-col text-center p-2 m-4">
            <h1 className="text-2xl">Connect your wallet</h1>
            <div className="flex-col justify-between sm:flex xs:flex">
                {small == false ? <a href="#" onClick={authenticateWithMetamask} className="focus:outline-none">
                    <div className="w-fill h-auto shadow-lg rounded-lg flex-col justify-items-center m-4 px-20 py-10">
                        <h2 className="mb-4 text-lg">Metamask</h2>
                        <Image 
                            src={Metamask}
                            alt="Metamask Logo"
                            width={60}
                            height={60}
                        />
                    </div>
                </a> : null}
                <a href="#" onClick={authenticateWithWalleCon} className="focus:outline-none">
                    <div className="w-fill h-auto shadow-lg rounded-lg flex-col justify-items-center m-4 px-20 py-10">
                        <h2 className="mb-4 text-lg">Wallet Connect</h2>
                        <Image 
                            src={WalletConIcon}
                            alt="WalletConnect Logo"
                            width={60}
                            height={60}
                        />
                    </div>
                </a>
            </div>
        </div>
      </div>
      <div className="wave-down relative">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
        </svg>
    </div>
    </div>
  )
}

export default Home
