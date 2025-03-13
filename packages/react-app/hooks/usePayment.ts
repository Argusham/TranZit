// // hooks/usePayments.ts

// import { useState } from "react";
// import { parseEther, encodeFunctionData } from "viem";
// import { useWalletClient, useAccount } from "wagmi";
// import erc20Abi from "../utils/erc20Abi.json"; 
// import cusdAbi from "../utils/cusdAbi.json";
// import { publicClient } from "../utils/publicClient"; 

// export const usePayments = (walletAddress: string | null) => {
//   const [loading, setLoading] = useState(false);
//   const taxiPaymentContractAddress = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
//   const cusdTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";

//   // Wagmi
//   const { data: walletClient } = useWalletClient();
//   const { address, isConnected } = useAccount();

//   // Approve cUSD spending
//   const approveCUSDSpending = async (spender: string, amount: string) => {
//     if (!walletClient || !address) {
//       console.error("No wallet client or address connected.");
//       return false;
//     }
//     try {
//       const amountInWei = parseEther(amount);
//       const txHash = await walletClient.writeContract({
//         address: cusdTokenAddress,
//         abi: erc20Abi,
//         functionName: "approve",
//         account: address,
//         args: [spender, amountInWei],
//       });

//       await publicClient.waitForTransactionReceipt({ hash: txHash });
//       return true;
//     } catch (error) {
//       console.error("Approval failed:", error);
//       return false;
//     }
//   };

//   // Pay a user
//   const payUser = async (recipient: string, amount: string) => {
//     if (!walletClient || !address) {
//       console.error("No wallet client or address connected.");
//       return;
//     }
//     try {
//       setLoading(true);

//       // Ensure approval
//       const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
//       if (!approved) {
//         console.error("Payment halted: Approval failed.");
//         setLoading(false);
//         return;
//       }

//       const amountInWei = parseEther(amount);
//       const callData = encodeFunctionData({
//         abi: cusdAbi,
//         functionName: "payUser",
//         args: [recipient, amountInWei],
//       });

//       // Estimate gas
//       const gasEstimate = await publicClient.estimateGas({
//         account: address,
//         to: taxiPaymentContractAddress,
//         data: callData,
//       });

//       // Execute payment
//       const txHash = await walletClient.writeContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "payUser",
//         account: address,
//         args: [recipient, amountInWei],
//         gas: gasEstimate,
//       });

//       await publicClient.waitForTransactionReceipt({ hash: txHash });
//       setLoading(false);
//       return txHash;
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

// // hooks/usePayments.ts
import { useState } from "react";
import { useSendTransaction } from "thirdweb/react";
import {getContract, prepareContractCall, prepareTransaction} from "thirdweb";
import { Chain, celo } from "thirdweb/chains";
import { client } from "../hooks/client";
import { parseEther } from "viem";

// Define the shape of a payment request for clarity and type safety
interface PaymentRequest {
  recipient: string; // Address to send funds to (could be a contract or wallet address)
  amount: string; // Amount to send (in ether)
  tokenAddress: string;
}

export function usePayments(defaultChain: Chain = celo) {
  // Local state
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState<Error | null>(null);

  // Thirdweb hook for sending transactions
  const { mutateAsync: sendTransaction, isPending: isSending, error: sendError, data: txResult, } = useSendTransaction();

  // Predefined contract addresses
  const taxiPaymentContractAddress ="0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
  const cusdTokenAddress ="0x765de816845861e75a25fca122bb6898b8b1282a";

  // Approve token spending
  const approveCUSDSpending = async ( spender: string,amount: string, ) => {
    try {
      const tokenContract = getContract({ address: cusdTokenAddress, chain: defaultChain, client: client, });
      const amountInWei = parseEther(amount);
      const approveTx = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [spender, amountInWei],
      });

      // Execute approval transaction
      await sendTransaction(approveTx);
      return true;
    } catch (error) {
      console.error("Approval failed:", error);
      return false;
    }
  };

  // Function to initiate a payment
  const payUser = async ({ recipient, amount, tokenAddress,}: PaymentRequest) => {
    try {
      setPrepareError(null);
      setIsPreparing(true);

      const amountInWei = parseEther(amount);

      if (tokenAddress) {
        // Token payment with approval
        // First, approve spending
        const approved = await approveCUSDSpending(
          taxiPaymentContractAddress,
          amount,
        );
        if (!approved) {
          throw new Error("Token approval failed");
        }

        // Prepare payment contract call
        const taxiContract = getContract({
          address: taxiPaymentContractAddress,
          chain: defaultChain,
          client: client,
        });

        const paymentTx = prepareContractCall({
          contract: taxiContract,
          method:  "function payUser(address recipient, uint256 amount)",
          params: [recipient, amountInWei],
        });

        // Execute payment transaction
        await sendTransaction(paymentTx);
      } else {
        // Native currency payment
        const preparedTx = prepareTransaction({
          to: recipient,
          value: amountInWei,
          chain: defaultChain,
          client: client,
        });

        // Execute native token transaction
        await sendTransaction(preparedTx);
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setPrepareError(err as Error);
    } finally {
      setIsPreparing(false);
    }
  };

  return {
    payUser,
    isLoading: isPreparing || isSending,
    error: prepareError || sendError || null,
    transactionResult: txResult,
  };
}
