import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { MoralisProvider } from "react-moralis";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <MoralisProvider appId={publicRuntimeConfig.APP_ID} serverUrl={publicRuntimeConfig.SERVER_URL}>
      <Head>
          <title>Non Fungible Documents</title>
      </Head>
      <Component {...pageProps} />
    </MoralisProvider>
  )
}
    
export default MyApp
