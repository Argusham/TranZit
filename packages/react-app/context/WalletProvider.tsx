/* eslint-disable react-hooks/exhaustive-deps */

// import { createContext, useContext, useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import { erc20Abi } from "viem";
// import { createPublicClient, http } from "viem";
// import { celo } from "viem/chains";

// const CELO_CUSD_CONTRACT = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // cUSD (mainnet)

// interface WalletContextType {
//   walletAddress: string | null;
//   walletBalance: string | null;
//   isConnected: boolean;
//   isOffline: boolean;
//   fetchWalletBalance: () => void;
// }

// const WalletContext = createContext<WalletContextType | undefined>(undefined);

// const WalletProvider = ({ children }: { children: React.ReactNode }) => {
//   const { address, isConnected } = useAccount();
//   const [walletBalance, setWalletBalance] = useState<string | null>("0");
//   const [isOffline, setIsOffline] = useState<boolean>(false);
//   const [hasMounted, setHasMounted] = useState(false); // Prevents hydration error

//   // For READ-ONLY calls:
//   const client = createPublicClient({
//     chain: celo,
//     transport: http(),
//   });

//   // Fix SSR hydration issues: Only run on client
//   useEffect(() => {
//     setHasMounted(true);
//     setIsOffline(!navigator.onLine);

//     const handleOnline = () => setIsOffline(false);
//     const handleOffline = () => setIsOffline(true);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   // Function to fetch cUSD balance
//   const fetchWalletBalance = async () => {
//     if (!address || isOffline) return;
//     try {
//       const balance = await client.readContract({
//         address: CELO_CUSD_CONTRACT,
//         abi: erc20Abi,
//         functionName: "balanceOf",
//         args: [address],
//       });

//       const formattedBalance = (Number(balance) / 1e18).toFixed(2);
//       setWalletBalance(formattedBalance);
//     } catch (error) {
//       console.error("Error fetching wallet balance:", error);
//       setWalletBalance("0");
//     }
//   };

//   useEffect(() => {
//     if (isConnected && address && !isOffline) {
//       fetchWalletBalance();
//     }
//   }, [isConnected, address, isOffline]);

//   // Fix: Prevent hydration mismatch by waiting for client to initialize
//   if (!hasMounted) return null;

//   return (
//     <WalletContext.Provider
//       value={{
//         walletAddress: address ?? null,
//         walletBalance,
//         isConnected: isConnected && !isOffline, // Prevent interactions when offline
//         isOffline,
//         fetchWalletBalance,
//       }}
//     >
//       {/* UI always remains visible, just show a banner when offline */}
//       {isOffline && (
//          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center bg-gray-800 text-sm font-semibold px-4 py-2 mt-4 rounded-full shadow-lg z-50">
//          <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
//          You are offline
//        </div>
//       )}
//       {children}
//     </WalletContext.Provider>
//   );
// };

// export const useWallets = () => {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error("useWallet must be used within WalletProvider");
//   }
//   return context;
// };

// // ✅ Fix: Ensure default export for `dynamic()`
// export default WalletProvider;


// WalletProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  useActiveAccount, 
  useActiveWallet, 
  useActiveWalletConnectionStatus, 
  useActiveWalletChain, 
  useWalletBalance, 
  useConnect, 
  useDisconnect, 
  useAutoConnect 
} from 'thirdweb/react';
import { createWallet, injectedProvider } from 'thirdweb/wallets';
import { client } from "../hooks/client"; // existing Thirdweb client configuration

// Define the shape of our wallet context state
interface WalletContextState {
  address: string | undefined;
  balance: string | undefined;
  balanceSymbol: string | undefined;
  chainId: number | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  error?: Error;
  isOffline: boolean;
}

// Create the context
const WalletContext = createContext<WalletContextState | undefined>(undefined);


const CUSD_CONTRACT_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";

// Custom hook to use the wallet context
export const useWallets = (): WalletContextState => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallets must be used within a WalletProvider');
  }
  return context;
};

// Provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Offline (network) detection
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Thirdweb hooks for wallet state
  const activeAccount = useActiveAccount();                   // active account (if any)&#8203;:contentReference[oaicite:5]{index=5}
  const connectionStatus = useActiveWalletConnectionStatus(); // connection status ('connected', 'connecting', etc)&#8203;:contentReference[oaicite:6]{index=6}
  const activeChain = useActiveWalletChain();                 // chain info of active wallet (if connected)
  const wallet = useActiveWallet();                           // wallet instance (for disconnect)

  // Fetch balance of the active account's native currency&#8203;:contentReference[oaicite:7]{index=7}
  const { data: balanceData } = useWalletBalance({
    address: activeAccount?.address,
    chain: activeChain,
    client,
    tokenAddress: CUSD_CONTRACT_ADDRESS
  });
  const balance = balanceData?.displayValue;
  const balanceSymbol = balanceData?.symbol;

  // Wallet connection hooks
  const { connect, isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  // Auto-connect last wallet on mount (similar to Wagmi's autoConnect)&#8203;:contentReference[oaicite:8]{index=8}
  useAutoConnect({ client });

  // Handler to connect wallet (using MetaMask in this example)
  const connectWallet = () => {
    connect(async () => {
      // Create a MetaMask wallet instance and attempt connection
      const metamask = createWallet('io.metamask');
      if (injectedProvider('io.metamask')) {
        await metamask.connect({ client });
      } else {
        throw new Error('MetaMask wallet not found');
      }
      return metamask;
    });
  };

  // Handler to disconnect the active wallet
  const disconnectWallet = () => {
    if (wallet) {
      disconnect(wallet);
    }
  };

  // Determine connection booleans from status
  const isConnected = connectionStatus === 'connected';
  const isDisconnected = connectionStatus === 'disconnected' || connectionStatus === 'unknown';
  // (Treat 'unknown' as disconnected initially to avoid SSR/hydration issues)
  
  return (
    <WalletContext.Provider
      value={{
        address: activeAccount?.address,
        balance,
        balanceSymbol,
        chainId: activeChain?.id,
        isConnected,
        isConnecting,
        isDisconnected,
        connectWallet,
        disconnectWallet,
        error: connectError || undefined,
        isOffline
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
