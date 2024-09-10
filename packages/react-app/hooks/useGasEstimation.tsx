import { useState, useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useWeb3 } from '@/context/useWeb3';

export const useGasEstimation = (recipient: string, amount: string) => {
  const { estimateGas, estimateGasPrice, address } = useWeb3();
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);

  useEffect(() => {
    if (recipient && amount && address) {
      const getEstimates = async () => {
        try {
          const value = parseUnits(amount, 18); // Assuming 'amount' is in ether units

          const estimatedGas = await estimateGas({
            from: address,
            to: recipient,
            value: value.toString(),
          });
          setGasEstimate(estimatedGas.toString());

          const priceWei = await estimateGasPrice();
          const price = BigInt(priceWei);
          setGasPrice(formatUnits(price, 18) + ' Gwei');
        } catch (error) {
          console.error('Error getting estimates:', error);
        }
      };

      getEstimates();
    }
  }, [recipient, amount, address, estimateGas, estimateGasPrice]);

  return { gasEstimate, gasPrice };
};
