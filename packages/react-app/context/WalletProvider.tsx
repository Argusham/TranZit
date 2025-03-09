/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useContext, useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth"; // ✅ Corrected import
import { erc20Abi } from "viem";
import { createPublicClient, http } from "viem";
import { celo } from "viem/chains";

const CELO_CUSD_CONTRACT = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // cUSD (mainnet)

interface WalletContextType {
  walletAddress: string | null;
  walletBalance: string | null;
  isConnected: boolean;
  isOffline: boolean;
  fetchWalletBalance: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { wallets } = useWallets(); // ✅ Corrected: Get the list of wallets
  const activeWallet = wallets.length > 0 ? wallets[0] : null; // ✅ Get first connected wallet

  const [walletBalance, setWalletBalance] = useState<string | null>("0");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState(false); // Prevents hydration error

  // Viem Public Client (Read-Only)
  const client = createPublicClient({
    chain: celo,
    transport: http(),
  });

  // Fix SSR hydration issues: Only run on client
  useEffect(() => {
    setHasMounted(true);
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Function to fetch cUSD balance
  const fetchWalletBalance = async () => {
    if (!activeWallet?.address || isOffline) return;
    try {
      const balance = await client.readContract({
        address: CELO_CUSD_CONTRACT,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [activeWallet.address as `0x${string}`], // ✅ Fetch balance for Privy's active wallet
      });

      const formattedBalance = (Number(balance) / 1e18).toFixed(2);
      setWalletBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setWalletBalance("0");
    }
  };

  useEffect(() => {
    if (activeWallet?.address && !isOffline) {
      fetchWalletBalance();
    }
  }, [activeWallet?.address, isOffline]);

  // Fix: Prevent hydration mismatch by waiting for client to initialize
  if (!hasMounted) return null;

  return (
    <WalletContext.Provider
      value={{
        walletAddress: activeWallet?.address ?? null, // ✅ Get active wallet's address
        walletBalance,
        isConnected: !!activeWallet && !isOffline, // ✅ Ensure there's an active wallet
        isOffline,
        fetchWalletBalance,
      }}
    >
      {/* UI always remains visible, just show a banner when offline */}
      {isOffline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center bg-gray-800 text-sm font-semibold px-4 py-2 mt-4 rounded-full shadow-lg z-50">
          <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
          You are offline
        </div>
      )}
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletsContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletsContext must be used within WalletProvider");
  }
  return context;
};

// ✅ Fix: Ensure default export for `dynamic()`
export default WalletProvider;
