/* eslint-disable react-hooks/exhaustive-deps */
// import { createContext, useContext, useEffect, useState } from "react";
// import { useAccount, useBalance } from "wagmi";

// interface WalletContextType {
//   walletAddress: string | null;
//   walletBalance: string | null;
//   isConnected: boolean;
// }

// const WalletContext = createContext<WalletContextType | undefined>(undefined);

// export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
//   const { address, isConnected } = useAccount();
//   const [walletBalance, setWalletBalance] = useState<string | null>("0");

//   // Fetch balance when the address changes
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (!address) return;
//       try {
//         const response = await fetch(
//           `https://api.celoscan.io/api?module=account&action=balance&address=${address}&tag=latest`
//         );
//         const data = await response.json();
//         if (data.result) {
//           setWalletBalance((Number(data.result) / 1e18).toFixed(2)); // Convert from Wei
//         }
//       } catch (error) {
//         console.error("Error fetching balance:", error);
//       }
//     };

//     fetchBalance();
//   }, [address]);

//   return (
//     <WalletContext.Provider value={{ walletAddress: address ?? null, walletBalance, isConnected }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// export const useWallet = () => {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error("useWallet must be used within WalletProvider");
//   }
//   return context;
// };


import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { erc20Abi } from "viem"; // Use viem for contract interaction
import { createPublicClient, http } from "viem";
import { celo, celoAlfajores } from "viem/chains";

const CELO_CUSD_CONTRACT = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // cUSD contract address

interface WalletContextType {
  walletAddress: string | null;
  walletBalance: string | null;
  isConnected: boolean;
  fetchWalletBalance: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const [walletBalance, setWalletBalance] = useState<string | null>("0");

  // Setup viem client for balance fetching
  const client = createPublicClient({
    chain: celo,
    transport: http(),
  });

  // Function to fetch cUSD balance
  const fetchWalletBalance = async () => {
    if (!address) return;
    try {
      const balance = await client.readContract({
        address: CELO_CUSD_CONTRACT,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      });

      const formattedBalance = (Number(balance) / 1e18).toFixed(2);
      setWalletBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setWalletBalance("0");
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchWalletBalance();
    }
  }, [isConnected, address]);

  return (
    <WalletContext.Provider value={{ walletAddress: address ?? null, walletBalance, isConnected, fetchWalletBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallets = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};
