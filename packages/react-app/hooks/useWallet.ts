// // hooks/useWallet.ts
// import { useState } from "react";
// import { createWalletClient, custom, getContract, formatEther } from "viem";
// import { celo } from "viem/chains";
// import { publicClient } from "../utils/publicClient";
// import erc20Abi from '../utils/erc20Abi.json'; // ERC20 ABI for cUSD functions like balanceOf

// export const useWallet = () => {
//   const [address, setAddress] = useState<string | null>(null);
//   const [currentWalletAmount, setCurrentWalletAmount] = useState<string | null>(null);


//   // Get user's wallet address
//   const getUserAddress = async () => {
//     if (typeof window !== "undefined" && window.ethereum) {
//       const walletClient = createWalletClient({
//         transport: custom(window.ethereum),
//         chain: celo,
//       });

//       const [userAddress] = await walletClient.getAddresses();
//       setAddress(userAddress);
//       await getCurrentWalletAmount(userAddress);  // Fetch balance on address set
//     }
//   };

//   const formatCUSD = (balance: bigint) => {
//     return (Number(balance) / 1e18).toFixed(2); // Ensure it formats to two decimal places
//   };
  

//   // Get cUSD balance using ERC20 ABI
//   const getCurrentWalletAmount = async (userAddress: string) => {
//     try {
//       const contract = getContract({
//         // address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // cUSD token address
//         address: '0x765de816845861e75a25fca122bb6898b8b1282a',
//         abi: erc20Abi, // Use ERC20 ABI for balanceOf function
//         client: publicClient,
//       });

//       // Get the balance as a bigint
//       const balance = await contract.read.balanceOf([userAddress]) as bigint; // Ensure type is bigint
//       const formattedBalance = formatCUSD(balance); // Convert to human-readable format (cUSD)
//       setCurrentWalletAmount(formattedBalance); // Update state with the balance
//     } catch (error) {
//       console.error("Failed to fetch balance:", error);
//       setCurrentWalletAmount(null); // Set to null on error
//     }
//   };

//   // Check if a transaction succeeded by looking up its transaction hash
//   const checkIfTransactionSucceeded = async (transactionHash: string) => {
//     try {
//       const formattedHash: `0x${string}` = transactionHash.startsWith('0x')
//         ? (transactionHash as `0x${string}`)
//         : (`0x${transactionHash}` as `0x${string}`);

//       const receipt = await publicClient.getTransactionReceipt({ hash: formattedHash });
//       return receipt.status === "success";
//     } catch (error) {
//       console.error("Failed to check transaction status:", error);
//       return false;
//     }
//   };

//   return {
//     address,
//     currentWalletAmount,
//     getUserAddress,
//     getCurrentWalletAmount,
//     checkIfTransactionSucceeded,
//   };
// };


import { useState } from "react";
import { getContract } from "viem";
import { useAccount } from "wagmi";
import { publicClient } from "../utils/publicClient";
import erc20Abi from "../utils/erc20Abi.json"; 

// cUSD mainnet address
const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";

export const useWallet = () => {
  const [currentWalletAmount, setCurrentWalletAmount] = useState<string | null>(null);

  // Wagmi for address
  const { address, isConnected } = useAccount();

  // Format cUSD
  const formatCUSD = (balance: bigint) => {
    return (Number(balance) / 1e18).toFixed(2);
  };

  // Get cUSD balance using ERC20 ABI
  const getCurrentWalletAmount = async (userAddress: string) => {
    try {
      const contract = getContract({
        address: cUSDTokenAddress,
        abi: erc20Abi,
        client: publicClient,
      });

      const balance = await contract.read.balanceOf([userAddress]) as bigint;
      setCurrentWalletAmount(formatCUSD(balance));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setCurrentWalletAmount(null);
    }
  };

  // If you want a function to fetch the address (though wagmi gives it to you directly)
  const getUserAddress = () => {
    // Since you're using Wagmi, your address is simply `address`
    return address;
  };

  // Check transaction success
  const checkIfTransactionSucceeded = async (transactionHash: string) => {
    try {
      // Ensure it has 0x prefix
      const formattedHash = transactionHash.startsWith("0x")
        ? (transactionHash as `0x${string}`)
        : (`0x${transactionHash}` as `0x${string}`);

      const receipt = await publicClient.getTransactionReceipt({ hash: formattedHash });
      return receipt.status === "success";
    } catch (error) {
      console.error("Failed to check transaction status:", error);
      return false;
    }
  };

  return {
    isConnected,
    address,
    currentWalletAmount,
    getUserAddress,
    getCurrentWalletAmount,
    checkIfTransactionSucceeded,
  };
};
