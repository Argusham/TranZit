// // hooks/usePayments.ts
// import { useState } from "react";
// import { createWalletClient, custom, parseEther, encodeFunctionData } from "viem";
// import { celo } from "viem/chains";
// import erc20Abi from '../utils/erc20Abi.json'; // ERC20 ABI
// import cusdAbi from '../utils/cusdAbi.json'; // TaxiPaymentcUSD ABI
// import { publicClient } from "../utils/publicClient"; // Import the publicClient utility

// export const usePayments = (address: any) => {
//   const [loading, setLoading] = useState(false);
//   // const taxiPaymentContractAddress = '0xAF556F1aecd2b5f2Ce7C83Da9f6B18491ce8eEA4';
//   const taxiPaymentContractAddress = '0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96';

//   // const cusdTokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1';
//   const cusdTokenAddress = '0x765de816845861e75a25fca122bb6898b8b1282a';

//   // Function to approve cUSD spending
//   const approveCUSDSpending = async (spender: string, amount: string) => {
//     const walletClient = createWalletClient({
//       transport: custom(window.ethereum),
//       chain: celo,
//     });

//     const [userAddress] = await walletClient.getAddresses(); // Get wallet address from wallet client
//     const amountInWei = parseEther(amount); // Parse amount to Wei
    
//     try {
//       const tx = await walletClient.writeContract({
//         address: cusdTokenAddress,
//         abi: erc20Abi,
//         functionName: "approve",
//         account: userAddress, // Use the fetched wallet address here
//         args: [spender, amountInWei],
//       });

//       await publicClient.waitForTransactionReceipt({ hash: tx });
//       return tx;
//     } catch (error) {
//       console.error("Approval failed:", error);
//     }
//   };

//   // Function to pay a user
//   const payUser = async (recipient: string, amount: string) => {
//     const walletClient = createWalletClient({
//       transport: custom(window.ethereum),
//       chain: celo,
//     });

//     const [userAddress] = await walletClient.getAddresses(); // Get wallet address
//     const amountInWei = parseEther(amount); // Convert amount to Wei

//     try {
//       setLoading(true);

//       await approveCUSDSpending(taxiPaymentContractAddress, amount);

//       const callData = encodeFunctionData({
//         abi: cusdAbi,
//         functionName: "payUser",
//         args: [recipient, amountInWei],
//       });

//       const gasEstimate = await publicClient.estimateGas({
//         account: userAddress, // Use the fetched wallet address here
//         to: taxiPaymentContractAddress,
//         data: callData,
//       });

//       const tx = await walletClient.writeContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "payUser",
//         account: userAddress, // Use the fetched wallet address here
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



// hooks/usePayments.ts
import { useState } from "react";
import { createWalletClient, custom, parseEther, encodeFunctionData } from "viem";
import { celo } from "viem/chains";
import erc20Abi from '../utils/erc20Abi.json'; // ERC20 ABI
import cusdAbi from '../utils/cusdAbi.json'; // TaxiPaymentcUSD ABI
import { publicClient } from "../utils/publicClient"; // Import the publicClient utility

export const usePayments = (address: any) => {
  const [loading, setLoading] = useState(false);
  const taxiPaymentContractAddress = '0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96';
  const cusdTokenAddress = '0x765de816845861e75a25fca122bb6898b8b1282a';

  // Function to approve cUSD spending
  const approveCUSDSpending = async (spender: string, amount: string) => {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celo,
    });

    const [userAddress] = await walletClient.getAddresses();
    const amountInWei = parseEther(amount);

    try {
      const tx = await walletClient.writeContract({
        address: cusdTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        account: userAddress,
        args: [spender, amountInWei],
      });

      await publicClient.waitForTransactionReceipt({ hash: tx });
      return true; // Return true on success
    } catch (error) {
      console.error("Approval failed:", error);
      return false; // Return false on failure
    }
  };

  // Function to pay a user
  const payUser = async (recipient: string, amount: string) => {
    const walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celo,
    });

    const [userAddress] = await walletClient.getAddresses();
    const amountInWei = parseEther(amount);

    try {
      setLoading(true);

      // Ensure approval before proceeding with payment
      const approved = await approveCUSDSpending(taxiPaymentContractAddress, amount);
      if (!approved) {
        console.error("Payment halted: Approval failed.");
        setLoading(false);
        return;
      }

      const callData = encodeFunctionData({
        abi: cusdAbi,
        functionName: "payUser",
        args: [recipient, amountInWei],
      });

      const gasEstimate = await publicClient.estimateGas({
        account: userAddress,
        to: taxiPaymentContractAddress,
        data: callData,
      });

      const tx = await walletClient.writeContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "payUser",
        account: userAddress,
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
