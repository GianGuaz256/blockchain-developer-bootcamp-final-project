const axios = require('axios');
const FormData = require('form-data');
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

type Attributes = {
  trait_type: string;
  value: string;
}

type JSONBodyRequest = {
  name: string;
  description: string;
  image: string;
  attributes: Attributes[];
}

export const pinJSONToIPFS = async (JSONBody: JSONBodyRequest) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const res = await axios.post(url, JSONBody, {
    headers: {
      pinata_api_key: publicRuntimeConfig.PINATA_API_KEY,
      pinata_secret_api_key: publicRuntimeConfig.PINATA_SECRET_API_KEY
    }
  })
  return res.data.IpfsHash;
}

export const pinFileToIPFS = async (file: File) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  console.log(file)

  let data = new FormData();
  data.append('file', file)

  const res = await axios.post(url, data, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: publicRuntimeConfig.PINATA_API_KEY,
      pinata_secret_api_key: publicRuntimeConfig.PINATA_SECRET_API_KEY
    }
  });
  return res.data.IpfsHash;
}