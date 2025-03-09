import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi"; // ✅ Use Privy's WagmiProvider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./wagmiConfig"; // ✅ Import custom Wagmi config
import { celo } from "viem/chains";


const queryClient = new QueryClient();

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider appId="cm724jmar01pzcjceo9oerzya"
    
    config={{
        defaultChain: celo,
        supportedChains: [celo], // ✅ Ensure Celo is the only supported chain
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
