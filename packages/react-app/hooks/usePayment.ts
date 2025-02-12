// hooks/usePayments.ts

import { useState } from "react";
import { parseEther, encodeFunctionData } from "viem";
import { useWalletClient, useAccount } from "wagmi";
import erc20Abi from "../utils/erc20Abi.json"; 
import cusdAbi from "../utils/cusdAbi.json";
import { publicClient } from "../utils/publicClient"; 

export const usePayments = (walletAddress: string | null) => {
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
