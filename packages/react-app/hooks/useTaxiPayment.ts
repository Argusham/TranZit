import { useState, useEffect } from "react";
import { createPublicClient, createWalletClient, custom, http, formatEther, parseEther } from "viem";
import { celoAlfajores } from "viem/chains";
import abi from '../utils/abi.json'; // Your contract's ABI

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

export const useTaxiPayment = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [userBalances, setUserBalances] = useState<{ balanceSpent: string; balanceReceived: string } | null>(null);
  const [taxPercent, setTaxPercent] = useState<string | null>(null);
  const [incentiveAmount, setIncentiveAmount] = useState<string | null>(null);
  const [incentiveTrigger, setIncentiveTrigger] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get user's wallet address
  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
      });

      const [userAddress] = await walletClient.getAddresses();
      setAddress(userAddress);
    }
  };

  // Function to pay a user
  const payUser = async (recipient: string, amount: string) => {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    const [userAddress] = await walletClient.getAddresses();
    const amountInWei = parseEther(amount);

    try {
      setLoading(true);
      const tx = await walletClient.writeContract({
        address: '0xe7E0BF2823F789306B90129eCC5e9aF5A3634123', // Your contract address
        abi,
        functionName: "payUser",
        account: userAddress,
        args: [recipient],
        value: amountInWei,
      });

      await publicClient.waitForTransactionReceipt({ hash: tx });
      setLoading(false);
      return tx;
    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
    }
  };

  // Get user balances
  const getUserBalances = async (userAddress: string) => {
    try {
      const balances = await publicClient.readContract({
        address: '0xe7E0BF2823F789306B90129eCC5e9aF5A3634123', // Your contract address
        abi,
        functionName: "getUserBalances",
        args: [userAddress],
      });

      // Assert the return value as a tuple of two bigints
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
        address: '0xe7E0BF2823F789306B90129eCC5e9aF5A3634123',
        abi,
        functionName: "TAX_PERCENT",
      });

      // Cast the result to bigint
      setTaxPercent((tax as bigint).toString());
    } catch (error) {
      console.error("Failed to fetch tax percentage:", error);
    }
  };

  // Fetch incentive amount
  const getIncentiveAmount = async () => {
    try {
      const incentive = await publicClient.readContract({
        address: '0xe7E0BF2823F789306B90129eCC5e9aF5A3634123',
        abi,
        functionName: "INCENTIVE_AMOUNT",
      });

      // Cast the result to bigint
      setIncentiveAmount(formatEther(incentive as bigint));
    } catch (error) {
      console.error("Failed to fetch incentive amount:", error);
    }
  };

  // Fetch incentive trigger
  const getIncentiveTrigger = async () => {
    try {
      const trigger = await publicClient.readContract({
        address: '0xe7E0BF2823F789306B90129eCC5e9aF5A3634123',
        abi,
        functionName: "INCENTIVE_TRIGGER",
      });

      // Cast the result to bigint
      setIncentiveTrigger((trigger as bigint).toString());
    } catch (error) {
      console.error("Failed to fetch incentive trigger:", error);
    }
  };

  return {
    address,
    getUserAddress,
    payUser,
    getUserBalances,
    userBalances,
    getTaxPercent,
    taxPercent,
    getIncentiveAmount,
    incentiveAmount,
    getIncentiveTrigger,
    incentiveTrigger,
    loading,
  };
};
