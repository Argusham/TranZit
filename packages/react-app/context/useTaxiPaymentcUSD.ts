import { useState } from "react";
import {  createWalletClient, custom,  formatEther, parseEther, encodeFunctionData, getContract } from "viem";
import { celo } from "viem/chains";
import cusdAbi from '../utils/cusdAbi.json'; // TaxiPaymentcUSD ABI
import erc20Abi from '../utils/erc20Abi.json'; // ERC20 ABI
import { publicClient } from "../utils/publicClient";


export const useTaxiPaymentcUSD = () => {
  const [address, setAddress] = useState<any | null>(null);
  const [userBalances, setUserBalances] = useState<{ balanceSpent: any; balanceReceived: any } | null>(null);
  const [taxPercent, setTaxPercent] = useState<any | null>(null);
  const [incentiveAmount, setIncentiveAmount] = useState<any | null>(null);
  const [incentiveTrigger, setIncentiveTrigger] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // const taxiPaymentContractAddress = '0xAF556F1aecd2b5f2Ce7C83Da9f6B18491ce8eEA4'; // TaxiPaymentcUSD contract address
  const taxiPaymentContractAddress = '0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96';

  // const cUSDTokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // cUSD token address on Celo Alfajores testnet
  const cUSDTokenAddress = '0x765de816845861e75a25fca122bb6898b8b1282a';

  // Get user's wallet address
  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celo,
      });

      const [userAddress] = await walletClient.getAddresses();
      setAddress(userAddress);
    }
  };

  // Function to approve cUSD spending by the TaxiPaymentcUSD contract
  const approveCUSDSpending = async (spender: string, amount: string) => {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celo,
    });

    const amountInWei = parseEther(amount);

    try {
      const tx = await walletClient.writeContract({
        address: cUSDTokenAddress, // cUSD token contract address
        abi: erc20Abi, // ERC20 ABI
        functionName: "approve",
        account: address,
        args: [spender, amountInWei], // Approving the TaxiPayment contract to spend the specified amount
      });

      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log('Approval successful');
      return tx;
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  // Function to pay a user with cUSD
  const payUser = async (recipient: string, amount: string) => {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celo,
    });

    const [userAddress] = await walletClient.getAddresses();
    const amountInWei = parseEther(amount); // Convert amount to Wei

    try {
      setLoading(true);

      // Step 1: Approve TaxiPaymentcUSD contract to spend cUSD
      await approveCUSDSpending(taxiPaymentContractAddress, amount);

      // Step 2: Encode function call data
      const callData = encodeFunctionData({
        abi: cusdAbi,
        functionName: "payUser",
        args: [recipient, amountInWei],
      });

      // Step 3: Estimate gas using publicClient with `to`, `from`, and `data`
      const gasEstimate = await publicClient.estimateGas({
        account: userAddress,
        to: taxiPaymentContractAddress,
        data: callData, // Use the encoded function call data
      });

      // Step 4: Execute the payment via TaxiPaymentcUSD contract
      const tx = await walletClient.writeContract({
        address: taxiPaymentContractAddress, // TaxiPaymentcUSD contract address
        abi: cusdAbi, // TaxiPaymentcUSD ABI
        functionName: "payUser",
        account: userAddress,
        args: [recipient, amountInWei], // Include recipient and amount in arguments
        gas: gasEstimate, // Use estimated gas
      });

      await publicClient.waitForTransactionReceipt({ hash: tx });
      setLoading(false);
      return tx;
    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
    }
  };


  // Get cUSD balance for a specific account
  const getCUSDTokenBalance = async (userAddress: any) => {
    try {
      const balance = await publicClient.readContract({
        address: cUSDTokenAddress, // cUSD token contract address
        abi: erc20Abi, // ERC20 ABI
        functionName: "balanceOf",
        args: [userAddress], // User address
      });

      return formatEther(balance as bigint); // Convert balance from Wei to cUSD
    } catch (error) {
      console.error("Failed to fetch cUSD balance:", error);
    }
  };

//   const getBalance = async (address: any) => {
//     const StableTokenContract = getContract({
//         address: cUSDTokenAddress,
//         abi: erc20Abi,
//         client: publicClient,
//     });

//     const balanceInBigNumber: any = await StableTokenContract.read.balanceOf([address]);
    

//     const balanceInWei = balanceInBigNumber;
//     const balanceInCUSD = formatEther(balanceInWei);

//     return balanceInCUSD;
// };



  // Get user balances from TaxiPaymentcUSD contract
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

  // Fetch tax percentage from the TaxiPaymentcUSD contract
  const getTaxPercent = async () => {
    try {
      const tax = await publicClient.readContract({
        address: taxiPaymentContractAddress, // TaxiPaymentcUSD contract address
        abi: cusdAbi, // TaxiPaymentcUSD ABI
        functionName: "TAX_PERCENT",
      });

      setTaxPercent((tax as bigint).toString());
    } catch (error) {
      console.error("Failed to fetch tax percentage:", error);
    }
  };

  // Fetch incentive amount from the TaxiPaymentcUSD contract
  const getIncentiveAmount = async () => {
    try {
      const incentive = await publicClient.readContract({
        address: taxiPaymentContractAddress, // TaxiPaymentcUSD contract address
        abi: cusdAbi, // TaxiPaymentcUSD ABI
        functionName: "INCENTIVE_AMOUNT",
      });

      setIncentiveAmount(formatEther(incentive as bigint));
    } catch (error) {
      console.error("Failed to fetch incentive amount:", error);
    }
  };

  // Fetch incentive trigger from the TaxiPaymentcUSD contract
  const getIncentiveTrigger = async () => {
    try {
      const trigger = await publicClient.readContract({
        address: taxiPaymentContractAddress, // TaxiPaymentcUSD contract address
        abi: cusdAbi, // TaxiPaymentcUSD ABI
        functionName: "INCENTIVE_TRIGGER",
      });

      setIncentiveTrigger((trigger as bigint).toString());
    } catch (error) {
      console.error("Failed to fetch incentive trigger:", error);
    }
  };

  return {
    address,
    getUserAddress,
    payUser,
    getCUSDTokenBalance,
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
