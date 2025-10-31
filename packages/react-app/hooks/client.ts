import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

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

export const taxiContract  = getContract({
  client,
  chain: defineChain(42220),
  // address: "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96",
    address: "0xEE8Ad478A25FC60766B9a0595A75504c64F4a946",
});

export const cUSDContract = getContract({
  client,
  chain: defineChain(42220),
  address: "0x765de816845861e75a25fca122bb6898b8b1282a",
});