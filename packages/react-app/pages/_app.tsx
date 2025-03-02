import { useEffect } from "react";
import dynamic from "next/dynamic"; // ✅ Import `dynamic()`
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { UserRoleProvider } from "@/context/UserRoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import client from "../utils/apolloClient";
import Head from "next/head";
import { PrivyProviderWrapper } from "@/context/PrivyProviderWrapper";

const WalletProvider = dynamic(() => import("@/context/WalletProvider"), {
  ssr: false, // ✅ Disable SSR for WalletProvider
});



const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(() => console.log("✅ Service Worker Registered"))
          .catch((err) => console.error("❌ Service Worker Registration Failed", err));
      } else {
        console.log("🛑 Service Worker is disabled in development mode");
      }
    }
  }, []);

  return (
    <>
      {/* ✅ PWA Metadata */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
         <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
          <link rel="apple-touch-icon" href="/blobby-192.png" />
      </Head>

      <PrivyProviderWrapper>
    
        <WalletProvider>
          <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
              <UserRoleProvider>
             
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
               
              </UserRoleProvider>
            </QueryClientProvider>
          </ApolloProvider>
        </WalletProvider>
     
      </PrivyProviderWrapper>
    </>
  );
}

export default App;
