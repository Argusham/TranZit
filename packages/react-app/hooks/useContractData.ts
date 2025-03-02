// // context/useContractData.ts

// import { useState } from "react";
// import { publicClient } from "../utils/publicClient"; 
// import { formatEther } from "viem";
// import cusdAbi from "../utils/cusdAbi.json"; // TaxiPaymentcUSD ABI

// export const useContractData = () => {
//   const [userBalances, setUserBalances] = useState<{ balanceSpent: any; balanceReceived: any } | null>(null);
//   const [taxPercent, setTaxPercent] = useState<string | null>(null);
//   const [incentiveAmount, setIncentiveAmount] = useState<string | null>(null);
//   const [incentiveTrigger, setIncentiveTrigger] = useState<string | null>(null);

//   // mainnet deployment
//   const taxiPaymentContractAddress = '0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96';

//   // Fetch user balances
//   const getUserBalances = async (userAddress: string) => {
//     try {
//       const balances = await publicClient.readContract({
//         address: taxiPaymentContractAddress,
//         abi: cusdAbi,
//         functionName: "getUserBalances",
//         args: [userAddress],
//       });

//       const [balanceSpent, balanceReceived] = balances as [bigint, bigint];
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

//       setIncentiveAmount((incentive as bigint).toString());
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
//     userBalances,
//     getUserBalances,
//     taxPercent,
//     getTaxPercent,
//     incentiveAmount,
//     getIncentiveAmount,
//     incentiveTrigger,
//     getIncentiveTrigger,
//   };
// };
import { useState } from "react";
import { publicClient } from "../utils/publicClient"; 
import { formatEther, Address } from "viem";
import cusdAbi from "../utils/cusdAbi.json"; // TaxiPaymentcUSD ABI

export const useContractData = () => {
  const [userBalances, setUserBalances] = useState<{ balanceSpent: string; balanceReceived: string } | null>(null);
  const [taxPercent, setTaxPercent] = useState<string | null>(null);
  const [incentiveAmount, setIncentiveAmount] = useState<string | null>(null);
  const [incentiveTrigger, setIncentiveTrigger] = useState<string | null>(null);

  const taxiPaymentContractAddress: Address = "0x7f8EFB57b228798d2d3ec3339cD0a155EB3B0f96";

  // ✅ Fetch user balances
  const getUserBalances = async (userAddress: Address) => {
    try {
      const balances = await publicClient.readContract({
        address: taxiPaymentContractAddress,
        abi: cusdAbi,
        functionName: "getUserBalances",
        args: [userAddress],
      });

      const [balanceSpent, balanceReceived] = balances as [bigint, bigint];
      setUserBalances({
        balanceSpent: formatEther(balanceSpent),
        balanceReceived: formatEther(balanceReceived),
      });
    } catch (error) {
      console.error("❌ Failed to fetch user balances:", error);
    }
  };

  return {
    userBalances,
    getUserBalances,
  };
};
