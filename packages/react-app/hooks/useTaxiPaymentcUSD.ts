// import { useState } from "react";
// import {
//   parseEther,
//   encodeFunctionData,
//   formatEther,
// } from "viem";
// import { useWalletClient, useAccount } from "wagmi"; 
// import { publicClient } from "../utils/publicClient";
// import cusdAbi from "../utils/cusdAbi.json";
// import erc20Abi from "../utils/erc20Abi.json";

// // Example addresses (Mainnet):
// const taxiPaymentContractAddress = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
// const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";

// export const useTaxiPaymentcUSD = () => {
//   const [userBalances, setUserBalances] = useState<{
//     balanceSpent: string;
//     balanceReceived: string;
//   } | null>(null);
//   const [taxPercent, setTaxPercent] = useState<string | null>(null);
//   const [incentiveAmount, setIncentiveAmount] = useState<string | null>(null);
//   const [incentiveTrigger, setIncentiveTrigger] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Wagmi hooks for connected wallet info
//   const { data: walletClient } = useWalletClient();
//   const { address, isConnected } = useAccount();

//   // Approve cUSD spending by the contract
//   const approveCUSDSpending = async (spender: `0x${string}`, amount: string) => {
//     if (!walletClient || !address) {
//       console.error("No wallet client or no address connected.");
//       return;
//     }
//     try {
//       const amountInWei = parseEther(amount);
//       const txHash = await walletClient.writeContract({
//         address: cUSDTokenAddress,
//         abi: erc20Abi,
//         functionName: "approve",
//         account: address,
//         args: [spender, amountInWei],
//       });

//       // Wait for receipt
//       await publicClient.waitForTransactionReceipt({ hash: txHash });
//       console.log("cUSD approval successful:", txHash);
//       return true;
//     } catch (error) {
//       console.error("Approval failed:", error);
//       return false;
//     }
//   };

//   // Pay a user with cUSD
//   const payUser = async (recipient: string, amount: string) => {
//     if (!walletClient || !address) {
//       console.error("No wallet client or address connected.");
//       return;
//     }
//     try {
//       setLoading(true);

//       // 1) Approve cUSD
//       const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
//       if (!approved) {
//         console.error("Payment halted: Approval failed.");
//         setLoading(false);
//         return;
//       }

//       // 2) Encode data
//       const amountInWei = parseEther(amount);
//       const callData = encodeFunctionData({
//         abi: cusdAbi,
//         functionName: "payUser",
//         args: [recipient, amountInWei],
//       });

//       // 3) Estimate gas
//       const gasEstimate = await publicClient.estimateGas({
//         account: address,
//         to: taxiPaymentContractAddress,
//         data: callData,
//       });

//       // 4) Pay user
//       const txHash = await walletClient.sendTransaction({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "payUser",
//         account: address,
//         args: [recipient, amountInWei],
//         gas: gasEstimate,
//         feeCurrency: cUSDTokenAddress,
//       });
//       await publicClient.waitForTransactionReceipt({ hash: txHash });

//       console.log("Payment transaction hash:", txHash);
//       setLoading(false);
//       return txHash;
//     } catch (error) {
//       console.error("Payment failed:", error);
//       setLoading(false);
//     }
//   };

//   // Get cUSD token balance (read-only)
//   const getCUSDTokenBalance = async (userAddress: string) => {
//     try {
//       const balance = await publicClient.readContract({
//         address: cUSDTokenAddress,
//         abi: erc20Abi,
//         functionName: "balanceOf",
//         args: [userAddress],
//       });
//       return formatEther(balance as bigint);
//     } catch (error) {
//       console.error("Failed to fetch cUSD balance:", error);
//       return "0";
//     }
//   };

//   // Get user balances from TaxiPaymentcUSD contract (read-only)
//   const getUserBalances = async (userAddress: string) => {
//     try {
//       const balances = await publicClient.readContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "getUserBalances",
//         args: [userAddress],
//       }) as [bigint, bigint];

//       const [balanceSpent, balanceReceived] = balances;
//       setUserBalances({
//         balanceSpent: formatEther(balanceSpent),
//         balanceReceived: formatEther(balanceReceived),
//       });
//     } catch (error) {
//       console.error("Failed to fetch user balances:", error);
//     }
//   };

//   // Fetch tax percentage
//   const getTaxPercent = async () => {
//     try {
//       const tax = await publicClient.readContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "TAX_PERCENT",
//       });
//       setTaxPercent((tax as bigint).toString());
//     } catch (error) {
//       console.error("Failed to fetch tax percentage:", error);
//     }
//   };

//   // Fetch incentive amount
//   const getIncentiveAmount = async () => {
//     try {
//       const incentive = await publicClient.readContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "INCENTIVE_AMOUNT",
//       });
//       setIncentiveAmount(formatEther(incentive as bigint));
//     } catch (error) {
//       console.error("Failed to fetch incentive amount:", error);
//     }
//   };

//   // Fetch incentive trigger
//   const getIncentiveTrigger = async () => {
//     try {
//       const trigger = await publicClient.readContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "INCENTIVE_TRIGGER",
//       });
//       setIncentiveTrigger((trigger as bigint).toString());
//     } catch (error) {
//       console.error("Failed to fetch incentive trigger:", error);
//     }
//   };

//   return {
//     address, // from wagmi
//     userBalances,
//     loading,
//     payUser,
//     approveCUSDSpending,
//     getCUSDTokenBalance,
//     getUserBalances,
//     taxPercent,
//     incentiveAmount,
//     incentiveTrigger,
//     getTaxPercent,
//     getIncentiveAmount,
//     getIncentiveTrigger,
//   };
// };


import { useState } from "react";
import { parseEther, encodeFunctionData, formatEther, Address, Hex } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { publicClient } from "../utils/publicClient";
import cusdAbi from "../utils/cusdAbi.json";
import erc20Abi from "../utils/erc20Abi.json";

// Example addresses (Mainnet):
const taxiPaymentContractAddress: Address = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
const cUSDTokenAddress: Address = "0x765de816845861e75a25fca122bb6898b8b1282a";

export const useTaxiPaymentcUSD = () => {
  const [userBalances, setUserBalances] = useState<{ balanceSpent: string; balanceReceived: string } | null>(null);
  const [taxPercent, setTaxPercent] = useState<string | null>(null);
  const [incentiveAmount, setIncentiveAmount] = useState<string | null>(null);
  const [incentiveTrigger, setIncentiveTrigger] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { wallets } = useWallets();
  const activeWallet = wallets.length > 0 ? wallets[0] : null;

  if (!activeWallet) {
    console.error("❌ No active wallet found.");
    return { payUser: async () => {}, approveCUSDSpending: async () => false, loading };
  }

  const getGasParams = async (from: Address, to: Address, data: Hex) => {
    try {
      const estimatedGasLimit = await publicClient.estimateGas({ account: from, to, data });
      const gasPrice = await publicClient.getGasPrice();

      return {
        gasLimit: estimatedGasLimit,
        gasPrice,
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: gasPrice,
      };
    } catch (error) {
      console.error("❌ Gas estimation failed:", error);
      return null;
    }
  };

  const sendTransaction = async (txData: { to: Address; data: Hex }) => {
    try {
      const provider = await activeWallet.getEthereumProvider();
      const accounts = await provider.request({ method: "eth_accounts" });
      const from = accounts[0] as Address;

      const gasParams = await getGasParams(from, txData.to, txData.data);
      if (!gasParams) throw new Error("Gas estimation failed.");

      const transactionParameters = {
        from,
        to: txData.to,
        data: txData.data,
        ...gasParams,
        chainId: "0xa4ec", // Celo Mainnet chain ID
      };

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      return txHash;
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      return null;
    }
  };

  const approveCUSDSpending = async (spender: Address, amount: string) => {
    if (!activeWallet?.address) {
      console.error("❌ No active wallet or address.");
      return false;
    }
    try {
      const amountInWei = parseEther(amount);
      const txData = {
        to: cUSDTokenAddress,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [spender, amountInWei],
        }),
      };

      const txHash = await sendTransaction(txData);
      return !!txHash;
    } catch (error) {
      console.error("❌ Approval failed:", error);
      return false;
    }
  };

  const payUser = async (recipient: Address, amount: string) => {
    if (!activeWallet?.address) {
      console.error("❌ No active wallet or address.");
      return;
    }
    try {
      setLoading(true);

      const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
      if (!approved) {
        console.error("❌ Payment halted: Approval failed.");
        setLoading(false);
        return;
      }

      const amountInWei = parseEther(amount);
      const txData = {
        to: taxiPaymentContractAddress,
        data: encodeFunctionData({
          abi: cusdAbi,
          functionName: "payUser",
          args: [recipient, amountInWei],
        }),
      };

      const txHash = await sendTransaction(txData);
      setLoading(false);
      return txHash;
    } catch (error) {
      console.error("❌ Payment failed:", error);
      setLoading(false);
    }
  };

  const getCUSDTokenBalance = async (userAddress: Address) => {
    try {
      const balance = await publicClient.readContract({
        address: cUSDTokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      });
      return formatEther(balance as bigint);
    } catch (error) {
      console.error("❌ Failed to fetch cUSD balance:", error);
      return "0";
    }
  };

  const getUserBalances = async (userAddress: Address) => {
    try {
      const balances = (await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "getUserBalances",
        args: [userAddress],
      })) as [bigint, bigint];

      setUserBalances({
        balanceSpent: formatEther(balances[0]),
        balanceReceived: formatEther(balances[1]),
      });
    } catch (error) {
      console.error("❌ Failed to fetch user balances:", error);
    }
  };

  const getTaxPercent = async () => {
    try {
      const tax = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "TAX_PERCENT",
      });
      setTaxPercent((tax as bigint).toString());
    } catch (error) {
      console.error("❌ Failed to fetch tax percentage:", error);
    }
  };

  const getIncentiveAmount = async () => {
    try {
      const incentive = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "INCENTIVE_AMOUNT",
      });
      setIncentiveAmount(formatEther(incentive as bigint));
    } catch (error) {
      console.error("❌ Failed to fetch incentive amount:", error);
    }
  };

  const getIncentiveTrigger = async () => {
    try {
      const trigger = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "INCENTIVE_TRIGGER",
      });
      setIncentiveTrigger((trigger as bigint).toString());
    } catch (error) {
      console.error("❌ Failed to fetch incentive trigger:", error);
    }
  };

  return {
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
