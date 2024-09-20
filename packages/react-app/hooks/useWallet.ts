// // context/useWallet.ts
// import { useState } from "react";
// import { createWalletClient, custom, getContract, formatEther } from "viem";
// import { celoAlfajores } from "viem/chains";
// import { publicClient } from "../utils/publicClient";
// import cusdAbi from '../utils/cusdAbi.json'; // Replace with your ABI if needed

// export const useWallet = () => {
//   const [address, setAddress] = useState<any | null>(null);
//   const [currentWalletAmount, setCurrentWalletAmount] = useState<string | null>(null);

//   // Get user's wallet address
//   const getUserAddress = async () => {
//     if (typeof window !== "undefined" && window.ethereum) {
//       const walletClient = createWalletClient({
//         transport: custom(window.ethereum),
//         chain: celoAlfajores,
//       });

//       const [userAddress] = await walletClient.getAddresses();
//       setAddress(userAddress);
//     }
//   };

//   // Get cUSD balance for a specific wallet address
//   const getBalance = async (userAddress: string) => {
//     try {
//       const contract = getContract({
//         address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // cUSD token address
//         abi: cusdAbi, // Your ABI
//         client: publicClient,
//       });

//       // Get the balance as bigint
//       const balance = await contract.read.balanceOf([userAddress]) as bigint; // Assert type as bigint
//       return formatEther(balance); // Convert to human-readable format (cUSD)
//     } catch (error) {
//       console.error("Failed to fetch balance:", error);
//       return null;
//     }
//   };

//   // Check if a transaction succeeded by looking up its transaction hash
//   const checkIfTransactionSucceeded = async (transactionHash: string) => {
//     try {
//       // Ensure transactionHash is in the correct format
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
//     getUserAddress,
//     getBalance,
//     checkIfTransactionSucceeded,
//   };
// };


import { useState } from "react";
import { createWalletClient, custom, getContract, formatEther } from "viem";
import { celoAlfajores } from "viem/chains";
import { publicClient } from "../utils/publicClient";
import erc20Abi from '../utils/erc20Abi.json'; // ERC20 ABI for cUSD functions like balanceOf
import cusdAbi from '../utils/cusdAbi.json'; // Contract-specific ABI

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [currentWalletAmount, setCurrentWalletAmount] = useState<string | null>(null);

  // Get user's wallet address
  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
      });

      const [userAddress] = await walletClient.getAddresses();
      setAddress(userAddress);
      await getCurrentWalletAmount(userAddress);  // Fetch balance on address set
    }
  };

  // Get cUSD balance using ERC20 ABI
  const getCurrentWalletAmount = async (userAddress: string) => {
    try {
      const contract = getContract({
        address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // cUSD token address
        abi: erc20Abi, // Use ERC20 ABI for balanceOf function
        client: publicClient,
      });

      // Get the balance as a bigint
      const balance = await contract.read.balanceOf([userAddress]) as bigint; // Ensure type is bigint
      const formattedBalance = formatEther(balance); // Convert to human-readable format (cUSD)
      setCurrentWalletAmount(formattedBalance); // Update state with the balance
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setCurrentWalletAmount(null); // Set to null on error
    }
  };

  // Existing getBalance function (keep as is)
  const getBalance = async (userAddress: string) => {
    try {
      const contract = getContract({
        address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // cUSD token address
        abi: cusdAbi, // Your specific contract ABI
        client: publicClient,
      });

      // Get balance as bigint
      const balance = await contract.read.balanceOf([userAddress]) as bigint;
      return formatEther(balance); // Return formatted balance
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      return null;
    }
  };

  // Check if a transaction succeeded by looking up its transaction hash
  const checkIfTransactionSucceeded = async (transactionHash: string) => {
    try {
      const formattedHash: `0x${string}` = transactionHash.startsWith('0x')
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
    address,
    currentWalletAmount,
    getUserAddress,
    getCurrentWalletAmount,
    getBalance,
    checkIfTransactionSucceeded,
  };
};
