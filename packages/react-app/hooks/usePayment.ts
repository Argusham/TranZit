// hooks/usePayments.ts
import { useState } from "react";
import { createWalletClient, custom, parseEther, encodeFunctionData } from "viem";
import { celoAlfajores } from "viem/chains";
import erc20Abi from '../utils/erc20Abi.json'; // ERC20 ABI
import cusdAbi from '../utils/cusdAbi.json'; // TaxiPaymentcUSD ABI
import { publicClient } from "../utils/publicClient"; // Import the publicClient utility

export const usePayments = (address: any) => {
  const [loading, setLoading] = useState(false);
  const taxiPaymentContractAddress = '0xAF556F1aecd2b5f2Ce7C83Da9f6B18491ce8eEA4';
  const cusdTokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';

  // Function to approve cUSD spending
  const approveCUSDSpending = async (spender: string, amount: string) => {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    const [userAddress] = await walletClient.getAddresses(); // Get wallet address from wallet client
    const amountInWei = parseEther(amount); // Parse amount to Wei
    
    try {
      const tx = await walletClient.writeContract({
        address: cusdTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        account: userAddress, // Use the fetched wallet address here
        args: [spender, amountInWei],
      });

      await publicClient.waitForTransactionReceipt({ hash: tx });
      return tx;
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  // Function to pay a user
  const payUser = async (recipient: string, amount: string) => {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    const [userAddress] = await walletClient.getAddresses(); // Get wallet address
    const amountInWei = parseEther(amount); // Convert amount to Wei

    try {
      setLoading(true);

      await approveCUSDSpending(taxiPaymentContractAddress, amount);

      const callData = encodeFunctionData({
        abi: cusdAbi,
        functionName: "payUser",
        args: [recipient, amountInWei],
      });

      const gasEstimate = await publicClient.estimateGas({
        account: userAddress, // Use the fetched wallet address here
        to: taxiPaymentContractAddress,
        data: callData,
      });

      const tx = await walletClient.writeContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "payUser",
        account: userAddress, // Use the fetched wallet address here
        args: [recipient, amountInWei],
        gas: gasEstimate,
      });

      await publicClient.waitForTransactionReceipt({ hash: tx });
      setLoading(false);
      return tx;
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
