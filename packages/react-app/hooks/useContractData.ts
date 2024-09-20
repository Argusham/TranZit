// context/useContractData.ts
import { useState } from "react";
import { publicClient } from "../utils/publicClient"; // Import the publicClient utility
import {  formatEther} from "viem";
import cusdAbi from '../utils/cusdAbi.json'; // TaxiPaymentcUSD ABI

export const useContractData = () => {
  const [userBalances, setUserBalances] = useState<{ balanceSpent: any; balanceReceived: any } | null>(null);
  const [taxPercent, setTaxPercent] = useState<string | null>(null); // Use string for percentages
  const [incentiveAmount, setIncentiveAmount] = useState<string | null>(null); // Use string to store formatted incentive amounts
  const [incentiveTrigger, setIncentiveTrigger] = useState<string | null>(null); // Use string for the trigger

  const taxiPaymentContractAddress = '0xAF556F1aecd2b5f2Ce7C83Da9f6B18491ce8eEA4';

  // Fetch user balances
  const getUserBalances = async (userAddress: string) => {
    try {
      const balances = await publicClient.readContract({
        address: taxiPaymentContractAddress, // TaxiPaymentcUSD contract address
        abi: cusdAbi, // TaxiPaymentcUSD ABI
        functionName: "getUserBalances",
        args: [userAddress],
      });

      const [balanceSpent, balanceReceived] = balances as [bigint, bigint];
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

      setTaxPercent((tax as bigint).toString()); // Type assertion for tax
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

      setIncentiveAmount((incentive as bigint).toString()); // Type assertion for incentive
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

      setIncentiveTrigger((trigger as bigint).toString()); // Type assertion for trigger
    } catch (error) {
      console.error("Failed to fetch incentive trigger:", error);
    }
  };

  return {
    userBalances,
    getUserBalances,
    taxPercent,
    getTaxPercent,
    incentiveAmount,
    getIncentiveAmount,
    incentiveTrigger,
    getIncentiveTrigger,
  };
};
