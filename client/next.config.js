/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    CONTRACT_ADDRESS_OLD: process.env.CONTRACT_ADDRESS_OLD,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
    APP_ID: process.env.APP_ID,
    SERVER_URL: process.env.SERVER_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    DOMAIN: process.env.DOMAIN
  }
}
