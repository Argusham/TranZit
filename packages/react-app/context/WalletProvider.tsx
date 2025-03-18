/* eslint-disable react-hooks/exhaustive-deps */

// WalletProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useActiveAccount, useActiveWallet, useActiveWalletConnectionStatus, 
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