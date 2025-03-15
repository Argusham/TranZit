import { useEffect } from "react";
import { WalletProvider } from "@/context/WalletProvider";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { UserRoleProvider } from "@/context/UserRoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../utils/apolloClient";
import { ThirdwebProvider } from "thirdweb/react";



const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {


  return (
    <>
      {/* ✅ PWA Metadata */}
     
      <ThirdwebProvider>
        <WalletProvider>
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              <UserRoleProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </UserRoleProvider>
            </QueryClientProvider>
          </ApolloProvider>
        </WalletProvider>
      </ThirdwebProvider>
    </>
  );
}

export default App;