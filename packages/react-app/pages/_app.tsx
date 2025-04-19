import { WalletProvider } from "@/context/WalletProvider";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { UserRoleProvider } from "@/context/UserRoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../utils/apolloClient";
import { ThirdwebProvider } from "thirdweb/react";
import Head from "next/head";
import "../utils/i18n"
import { appWithTranslation } from 'next-i18next';

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/ios-192.png" />
      </Head>

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

export default appWithTranslation(App);
