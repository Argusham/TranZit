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

const contract = getContract({
  client,
  chain: defineChain(42220),
  address: "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96",
});