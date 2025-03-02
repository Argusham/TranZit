import { createConfig } from "@privy-io/wagmi"; // ✅ Use Privy's version
import { celo, celoAlfajores } from "viem/chains"; // ✅ Viem chains for Wagmi
import { http } from "wagmi";

export const wagmiConfig = createConfig({
  chains: [celo, celoAlfajores], // ✅ Use only Celo chains
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});
