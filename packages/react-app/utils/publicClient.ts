// utils/publicClient.ts
import { createPublicClient, http } from "viem";
import { celoAlfajores } from "viem/chains";

// Create a public client to interact with the Celo Alfajores testnet
export const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});
