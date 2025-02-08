// // hooks/usePayments.ts
// import { useState } from "react";
// import { createWalletClient, custom, parseEther, encodeFunctionData } from "viem";
// import { celo } from "viem/chains";
// import erc20Abi from '../utils/erc20Abi.json'; // ERC20 ABI
// import cusdAbi from '../utils/cusdAbi.json'; // TaxiPaymentcUSD ABI
// import { publicClient } from "../utils/publicClient"; // Import the publicClient utility

// export const usePayments = (address: any) => {
//   const [loading, setLoading] = useState(false);
//   const taxiPaymentContractAddress = '0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96';
//   const cusdTokenAddress = '0x765de816845861e75a25fca122bb6898b8b1282a';

//   // Function to approve cUSD spending
//   const approveCUSDSpending = async (spender: string, amount: string) => {
//     const walletClient = createWalletClient({
//       transport: custom(window.ethereum),
//       chain: celo,
//     });

//     const [userAddress] = await walletClient.getAddresses();
//     const amountInWei = parseEther(amount);

//     try {
//       const tx = await walletClient.writeContract({
//         address: cusdTokenAddress,
//         abi: erc20Abi,
//         functionName: "approve",
//         account: userAddress,
//         args: [spender, amountInWei],
//       });

//       await publicClient.waitForTransactionReceipt({ hash: tx });
//       return true; // Return true on success
//     } catch (error) {
//       console.error("Approval failed:", error);
//       return false; // Return false on failure
//     }
//   };

//   // Function to pay a user
//   const payUser = async (recipient: string, amount: string) => {
//     const walletClient = createWalletClient({
//       transport: custom(window.ethereum),
//       chain: celo,
//     });

//     const [userAddress] = await walletClient.getAddresses();
//     const amountInWei = parseEther(amount);

//     try {
//       setLoading(true);

//       // Ensure approval before proceeding with payment
//       const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
//       if (!approved) {
//         console.error("Payment halted: Approval failed.");
//         setLoading(false);
//         return;
//       }

//       const callData = encodeFunctionData({
//         abi: cusdAbi,
//         functionName: "payUser",
//         args: [recipient, amountInWei],
//       });

//       const gasEstimate = await publicClient.estimateGas({
//         account: userAddress,
//         to: taxiPaymentContractAddress,
//         data: callData,
//       });

//       const tx = await walletClient.writeContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "payUser",
//         account: userAddress,
//         args: [recipient, amountInWei],
//         gas: gasEstimate,
//       });

//       await publicClient.waitForTransactionReceipt({ hash: tx });
//       setLoading(false);
//       return tx;
//     } catch (error) {
//       console.error("Payment failed:", error);
//       setLoading(false);
//     }
//   };

//   return {
//     payUser,
//     loading,
//   };
// };



import { useState } from "react";
import { parseEther, encodeFunctionData } from "viem";
import { useWalletClient, useAccount } from "wagmi";
import erc20Abi from "../utils/erc20Abi.json"; 
import cusdAbi from "../utils/cusdAbi.json";
import { publicClient } from "../utils/publicClient"; 

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const taxiPaymentContractAddress = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
  const cusdTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";

  // Wagmi
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();

  // Approve cUSD spending
  const approveCUSDSpending = async (spender: string, amount: string) => {
    if (!walletClient || !address) {
      console.error("No wallet client or address connected.");
      return false;
    }
    try {
      const amountInWei = parseEther(amount);
      const txHash = await walletClient.writeContract({
        address: cusdTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        account: address,
        args: [spender, amountInWei],
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      return true;
    } catch (error) {
      console.error("Approval failed:", error);
      return false;
    }
  };

  // Pay a user
  const payUser = async (recipient: string, amount: string) => {
    if (!walletClient || !address) {
      console.error("No wallet client or address connected.");
      return;
    }
    try {
      setLoading(true);

      // Ensure approval
      const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
      if (!approved) {
        console.error("Payment halted: Approval failed.");
        setLoading(false);
        return;
      }

      const amountInWei = parseEther(amount);
      const callData = encodeFunctionData({
        abi: cusdAbi,
        functionName: "payUser",
        args: [recipient, amountInWei],
      });

      // Estimate gas
      const gasEstimate = await publicClient.estimateGas({
        account: address,
        to: taxiPaymentContractAddress,
        data: callData,
      });

      // Execute payment
      const txHash = await walletClient.writeContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "payUser",
        account: address,
        args: [recipient, amountInWei],
        gas: gasEstimate,
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      setLoading(false);
      return txHash;
    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
    }
  };

  return {
    payUser,
    loading,
  };
};
