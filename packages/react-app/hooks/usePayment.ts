// hooks/usePayments.ts
import { useState } from "react";
import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, prepareTransaction } from "thirdweb";
import { celo } from "thirdweb/chains";
import { taxiContract, cUSDContract, client } from "../hooks/client";
import { parseEther } from "viem";

// Define the shape of a payment request for clarity and type safety
interface PaymentRequest {
  recipient: string; // Address to send funds to (could be a contract or wallet address)
  amount: string; // Amount to send (in ether)
  tokenAddress: string;
}

export function usePayments() {
  // Local state
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState<Error | null>(null);

  // Thirdweb hook for sending transactions
  const {
    mutateAsync: sendTransaction,
    isPending: isSending,
    error: sendError,
    data: txResult,
  } = useSendTransaction();

  // Approve token spending
  const approveCUSDSpending = async (spender: string, amount: string) => {
    try {
      const amountInWei = parseEther(amount);

      const approveTx = prepareContractCall({
        contract: cUSDContract,
        method: "function approve(address spender, uint256 amount)",
        params: [spender, amountInWei],
      });

      // Execute approval transaction
      await sendTransaction(approveTx);
      return true;
    } catch (error) {
      console.error("Approval failed:", error);
      return false;
    }
  };

  // Function to initiate a payment
  const payUser = async ({
    recipient,
    amount,
    tokenAddress,
  }: PaymentRequest) => {
    try {
      setPrepareError(null);
      setIsPreparing(true);

      const amountInWei = parseEther(amount);

      if (tokenAddress) {
        // Token payment with approval
        // First, approve spending
        const approved = await approveCUSDSpending(
          taxiContract.address,
          amount
        );
        if (!approved) {
          throw new Error("Token approval failed");
        }

        const paymentTx = prepareContractCall({
          contract: taxiContract,
          method: "function payUser(address recipient, uint256 amount)",
          params: [recipient, amountInWei],
        });

        // Execute payment transaction
        await sendTransaction(paymentTx);
      } else {
        // Native currency payment
        const preparedTx = prepareTransaction({
          to: recipient,
          value: amountInWei,
          chain: celo,
          client: client,
        });

        // Execute native token transaction
        await sendTransaction(preparedTx);
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setPrepareError(err as Error);
    } finally {
      setIsPreparing(false);
    }
  };

  return {
    payUser,
    isLoading: isPreparing || isSending,
    error: prepareError || sendError || null,
    transactionResult: txResult,
  };
}
