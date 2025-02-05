// utils/publicClient.ts
import { createPublicClient, http } from "viem";
import { celo } from "viem/chains";

// Create a public client to interact with the Celo Alfajores testnet
export const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});
