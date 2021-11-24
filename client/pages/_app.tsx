import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { MoralisProvider } from "react-moralis";
import getConfig from "next/config";
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <>
      <Head>
          <title>Non Fungible Documents</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
    
export default MyApp
