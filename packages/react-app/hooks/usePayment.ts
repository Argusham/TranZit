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


// import { useState, useEffect } from "react";
// import { parseEther, encodeFunctionData, Address, Hex } from "viem";
// import { useWallets } from "@privy-io/react-auth"; // ✅ Use Privy for wallet authentication
// import { publicClient } from "../utils/publicClient";
// import erc20Abi from "../utils/erc20Abi.json";
// import cusdAbi from "../utils/cusdAbi.json";

// export const usePayments = () => {
//   const [loading, setLoading] = useState(false);
//   const taxiPaymentContractAddress: Address = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
//   const cusdTokenAddress: Address = "0x765de816845861e75a25fca122bb6898b8b1282a";

//   const { wallets } = useWallets(); // ✅ Fetch wallets from Privy
//   const activeWallet = wallets.length > 0 ? wallets[0] : null; // ✅ Use first available wallet

//   useEffect(() => {
//     if (!activeWallet) {
//       console.warn("⏳ Waiting for wallet client...");
//     }
//   }, [activeWallet]);

//   if (!activeWallet) {
//     console.error("❌ Wallet client is not available.");
//     return { payUser: async () => {}, loading };
//   }

//   // ✅ Function to send transaction using the EIP-1193 provider
//   const sendTransaction = async (txData: { to: Address; data: Hex }) => {
//     try {
//         const provider = await activeWallet.getEthereumProvider();
//         const accounts = await provider.request({ method: "eth_accounts" });
//         const from = accounts[0];

//         // ✅ Estimate gas
//         const gasLimit = await provider.request({
//             method: "eth_estimateGas",
//             params: [
//                 {
//                     from,
//                     to: txData.to,
//                     data: txData.data,
//                 },
//             ],
//         });

//         // ✅ Fetch gas price (Celo uses `gasPrice`)
//         const gasPrice = await provider.request({
//             method: "eth_gasPrice",
//             params: [],
//         });

//         const transactionParameters = {
//             from,
//             to: txData.to,
//             data: txData.data,
//             gas: gasLimit, // ✅ Use estimated gas limit
//             gasPrice, // ✅ Use Celo's gas price
//             chainId: 42220, // ✅ Ensure you're on Celo mainnet
//         };

//         // ✅ Send transaction
//         const txHash = await provider.request({
//             method: "eth_sendTransaction",
//             params: [transactionParameters],
//         });

//         await publicClient.waitForTransactionReceipt({ hash: txHash });
//         return txHash;
//     } catch (error) {
//         console.error("❌ Transaction failed:", error);
//         return null;
//     }
// };


//   // ✅ Approve cUSD spending
//   const approveCUSDSpending = async (spender: Address, amount: string) => {
//     if (!activeWallet?.address) {
//       console.error("❌ No wallet client or address connected.");
//       return false;
//     }
//     try {
//       const amountInWei = parseEther(amount);

//       const txData = {
//         to: cusdTokenAddress,
//         data: encodeFunctionData({
//           abi: erc20Abi,
//           functionName: "approve",
//           args: [spender, amountInWei],
//         }),
//       };

//       const txHash = await sendTransaction(txData);
//       return !!txHash; // ✅ Return true if successful
//     } catch (error) {
//       console.error("❌ Approval failed:", error);
//       return false;
//     }
//   };

//   // ✅ Pay a user
//   const payUser = async (recipient: Address, amount: string) => {
//     if (!activeWallet?.address) {
//       console.error("❌ No wallet client or address connected.");
//       return;
//     }
//     try {
//       setLoading(true);

//       // Ensure approval before proceeding
//       const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
//       if (!approved) {
//         console.error("❌ Payment halted: Approval failed.");
//         setLoading(false);
//         return;
//       }

//       const amountInWei = parseEther(amount);

//       // ✅ Prepare transaction
//       const txData = {
//         to: taxiPaymentContractAddress,
//         data: encodeFunctionData({
//           abi: cusdAbi,
//           functionName: "payUser",
//           args: [recipient, amountInWei],
//         }),
//       };

//       // ✅ Send transaction using the EIP-1193 provider
//       const txHash = await sendTransaction(txData);
//       setLoading(false);
//       return txHash;
//     } catch (error) {
//       console.error("❌ Payment failed:", error);
//       setLoading(false);
//     }
//   };

//   return {
//     payUser,
//     loading,
//   };
// };


import { useState, useEffect } from "react";
import { parseEther, encodeFunctionData, Address, Hex, formatUnits } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { publicClient } from "../utils/publicClient";
import erc20Abi from "../utils/erc20Abi.json";
import cusdAbi from "../utils/cusdAbi.json";

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const taxiPaymentContractAddress: Address = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";
  const cusdTokenAddress: Address = "0x765de816845861e75a25fca122bb6898b8b1282a";

  const { wallets } = useWallets();
  const activeWallet = wallets.length > 0 ? wallets[0] : null;

  useEffect(() => {
    if (!activeWallet) {
      console.warn("⏳ Waiting for wallet client...");
    }
  }, [activeWallet]);

  if (!activeWallet) {
    console.error("❌ Wallet client is not available.");
    return { payUser: async () => {}, loading };
  }

  // ✅ Get gas parameters for Celo
  const getGasParams = async (from: Address, to: Address, data: Hex) => {
    try {
      // ✅ Estimate gas
      const estimatedGasLimit = await publicClient.estimateGas({
        account: from,
        to,
        data,
      });

      // ✅ Fetch gas price
      const gasPrice = await publicClient.getGasPrice();

      // ✅ Celo uses `maxFeePerGas` and `maxPriorityFeePerGas`
      return {
        gasLimit: estimatedGasLimit,
        gasPrice: gasPrice, // ✅ Explicitly set gas price
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: gasPrice, // Celo doesn't use priority fees, so use same value
      };
    } catch (error) {
      console.error("❌ Gas estimation failed:", error);
      return null;
    }
  };

  // ✅ Function to send transaction using Privy’s provider
  const sendTransaction = async (txData: { to: Address; data: Hex }) => {
    try {
      const provider = await activeWallet.getEthereumProvider();
      const accounts = await provider.request({ method: "eth_accounts" });
      const from = accounts[0] as Address;

      const gasParams = await getGasParams(from, txData.to, txData.data);
      if (!gasParams) throw new Error("Gas estimation failed.");

      // ✅ Correctly format `chainId` for Celo (hex format required)
      const transactionParameters = {
        from,
        to: txData.to,
        data: txData.data,
        ...gasParams,
        chainId: "0xa4ec", // ✅ Celo mainnet chain ID in hex
      };

      // ✅ Send transaction using Privy provider
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

  // ✅ Approve cUSD spending
  const approveCUSDSpending = async (spender: Address, amount: string) => {
    if (!activeWallet?.address) {
      console.error("❌ No wallet client or address connected.");
      return false;
    }
    try {
      const amountInWei = parseEther(amount);
      const txData = {
        to: cusdTokenAddress,
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

  // ✅ Pay a user
  const payUser = async (recipient: Address, amount: string) => {
    if (!activeWallet?.address) {
      console.error("❌ No wallet client or address connected.");
      return;
    }
    try {
      setLoading(true);

      // ✅ Ensure approval before proceeding
      const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
      if (!approved) {
        console.error("❌ Payment halted: Approval failed.");
        setLoading(false);
        return;
      }

      const amountInWei = parseEther(amount);

      // ✅ Prepare transaction
      const txData = {
        to: taxiPaymentContractAddress,
        data: encodeFunctionData({
          abi: cusdAbi,
          functionName: "payUser",
          args: [recipient, amountInWei],
        }),
      };

      // ✅ Send transaction
      const txHash = await sendTransaction(txData);
      setLoading(false);
      return txHash;
    } catch (error) {
      console.error("❌ Payment failed:", error);
      setLoading(false);
    }
  };

  return {
    payUser,
    loading,
  };
};
