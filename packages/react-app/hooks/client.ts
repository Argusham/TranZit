// // thirdwebClient.ts
// import {
//     createThirdwebClient,
//     getContract,
//   } from "thirdweb";
//   import { defineChain } from "thirdweb/chains";
  
//   require("dotenv").config();

//   const apikey = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string;
//   // 1. Create the client with your clientId,
//   // or a secretKey if in a server environment
//   export const thirdwebClient = createThirdwebClient({
//     clientId: apikey, 
//     // or secretKey: "YOUR_SECRET_KEY" (server only)
//   });
  
//   // 2. Connect to a specific contract on Celo (42220)
//   export const thirdwebContract = getContract({
//     client: thirdwebClient,
//     chain: defineChain(42220),
//     address: "0xf86AE66b74CB1F06eDeF18bCDc38469B6A064df8",
//   });
  

import { createThirdwebClient } from "thirdweb";

require("dotenv").config();

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId =  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});
