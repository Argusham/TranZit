// services/Web3Service.ts
import { parseUnits, formatUnits } from "viem";

export const getBalanceAndAddress = async (getUserAddress: any, getBalance: any) => {
  const address = await getUserAddress();
  if (address) {
    const balance = await getBalance(address);
    return { address, balance };
  }
  return { address: null, balance: null };
};

export const getGasEstimates = async (address: string, recipient: string, amount: string, estimateGas: any, estimateGasPrice: any) => {
  try {
    const value = parseUnits(amount, 18); // Assuming 'amount' is in ether units
    const estimatedGas = await estimateGas({ from: address, to: recipient, value: value.toString() });
    const priceWei = await estimateGasPrice();
    const gasPrice = formatUnits(BigInt(priceWei), 18) + " Gwei"; // Convert gas price
    return { estimatedGas: estimatedGas.toString(), gasPrice };
  } catch (error) {
    console.error("Error getting estimates:", error);
    return { estimatedGas: null, gasPrice: null };
  }
};
