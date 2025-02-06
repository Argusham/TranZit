import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { injectedWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { http, WagmiProvider, createConfig } from "wagmi";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { celo, celoAlfajores } from "wagmi/chains";
import { UserRoleProvider } from "@/context/UserRoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client"; // Apollo import
import client from "../utils/apolloClient"; // Apollo client you created
import Head from "next/head";
import { WalletProvider } from "@/context/WalletProvider";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, walletConnectWallet],
    },
  ],
  {
    appName: "Celo Composer",
    projectId: "044601f65212332475a09bc14ceb3c34",
  }
);

const config = createConfig({
  connectors,
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
   <>

    {/* ✅ PWA Metadata */}
    <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>

    <WagmiProvider config={config}>
    <WalletProvider>
      <ApolloProvider client={client}>
        
        {/* ApolloProvider wraps everything */}
        <QueryClientProvider client={queryClient}>
          <UserRoleProvider>
            <RainbowKitProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </RainbowKitProvider>
          </UserRoleProvider>
        </QueryClientProvider>
      </ApolloProvider>
      </WalletProvider>
    </WagmiProvider>
   </>
  );
}

export default App;
