import { useState } from "react";
import {
  parseEther,
  encodeFunctionData,
  formatEther,
} from "viem";
import { useWalletClient, useAccount } from "wagmi"; 
import { publicClient } from "../utils/publicClient";
import cusdAbi from "../utils/cusdAbi.json";
import erc20Abi from "../utils/erc20Abi.json";

// Example addresses (Mainnet):
const taxiPaymentContractAddress = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";

export const useTaxiPaymentcUSD = () => {
  const [userBalances, setUserBalances] = useState<{
    balanceSpent: string;
    balanceReceived: string;
  } | null>(null);
  const [taxPercent, setTaxPercent] = useState<string | null>(null);
  const [incentiveAmount, setIncentiveAmount] = useState<string | null>(null);
  const [incentiveTrigger, setIncentiveTrigger] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Wagmi hooks for connected wallet info
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();

  // Approve cUSD spending by the contract
  const approveCUSDSpending = async (spender: `0x${string}`, amount: string) => {
    if (!walletClient || !address) {
      console.error("No wallet client or no address connected.");
      return;
    }
    try {
      const amountInWei = parseEther(amount);
      const txHash = await walletClient.writeContract({
        address: cUSDTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        account: address,
        args: [spender, amountInWei],
      });

      // Wait for receipt
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      console.log("cUSD approval successful:", txHash);
      return true;
    } catch (error) {
      console.error("Approval failed:", error);
      return false;
    }
  };

  // Pay a user with cUSD
  const payUser = async (recipient: string, amount: string) => {
    if (!walletClient || !address) {
      console.error("No wallet client or address connected.");
      return;
    }
    try {
      setLoading(true);

      // 1) Approve cUSD
      const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
      if (!approved) {
        console.error("Payment halted: Approval failed.");
        setLoading(false);
        return;
      }

      // 2) Encode data
      const amountInWei = parseEther(amount);
      const callData = encodeFunctionData({
        abi: cusdAbi,
        functionName: "payUser",
        args: [recipient, amountInWei],
      });

      // 3) Estimate gas
      const gasEstimate = await publicClient.estimateGas({
        account: address,
        to: taxiPaymentContractAddress,
        data: callData,
      });

      // 4) Pay user
      const txHash = await walletClient.writeContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "payUser",
        account: address,
        args: [recipient, amountInWei],
        gas: gasEstimate,
      });
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      console.log("Payment transaction hash:", txHash);
      setLoading(false);
      return txHash;
    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
    }
  };

  // Get cUSD token balance (read-only)
  const getCUSDTokenBalance = async (userAddress: string) => {
    try {
      const balance = await publicClient.readContract({
        address: cUSDTokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      });
      return formatEther(balance as bigint);
    } catch (error) {
      console.error("Failed to fetch cUSD balance:", error);
      return "0";
    }
  };

  // Get user balances from TaxiPaymentcUSD contract (read-only)
  const getUserBalances = async (userAddress: string) => {
    try {
      const balances = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "getUserBalances",
        args: [userAddress],
      }) as [bigint, bigint];

      const [balanceSpent, balanceReceived] = balances;
      setUserBalances({
        balanceSpent: formatEther(balanceSpent),
        balanceReceived: formatEther(balanceReceived),
      });
    } catch (error) {
      console.error("Failed to fetch user balances:", error);
    }
  };

  // Fetch tax percentage
  const getTaxPercent = async () => {
    try {
      const tax = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "TAX_PERCENT",
      });
      setTaxPercent((tax as bigint).toString());
    } catch (error) {
      console.error("Failed to fetch tax percentage:", error);
    }
  };

  // Fetch incentive amount
  const getIncentiveAmount = async () => {
    try {
      const incentive = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "INCENTIVE_AMOUNT",
      });
      setIncentiveAmount(formatEther(incentive as bigint));
    } catch (error) {
      console.error("Failed to fetch incentive amount:", error);
    }
  };

  // Fetch incentive trigger
  const getIncentiveTrigger = async () => {
    try {
      const trigger = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "INCENTIVE_TRIGGER",
      });
      setIncentiveTrigger((trigger as bigint).toString());
    } catch (error) {
      console.error("Failed to fetch incentive trigger:", error);
    }
  };

  return {
    address, // from wagmi
    userBalances,
    loading,
    payUser,
    approveCUSDSpending,
    getCUSDTokenBalance,
    getUserBalances,
    taxPercent,
    incentiveAmount,
    incentiveTrigger,
    getTaxPercent,
    getIncentiveAmount,
    getIncentiveTrigger,
  };
};
