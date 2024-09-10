import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/useWeb3';

export const useWeb3State = () => {
  const { address, getUserAddress, getBalance, sendCUSD, checkIfTransactionSucceeded } = useWeb3();
  const [balance, setBalance] = useState<string>('');
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [tx, setTx] = useState<any>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signingLoading, setSigningLoading] = useState(false);

  // Fetch user address and balance
  useEffect(() => {
    getUserAddress().then(async () => {
      if (address) {
        const userBalance = await getBalance(address);
        setBalance(userBalance);
      }
    });
  }, [address, getBalance, getUserAddress]);

  // Check the transaction status
  useEffect(() => {
    const checkStatus = async () => {
      if (tx) {
        const status = await checkIfTransactionSucceeded(tx.transactionHash);
        setTransactionStatus(status ? 'Successful 😃' : 'Failed 😒');
      }
    };
    checkStatus();
  }, [tx, checkIfTransactionSucceeded]);

  // Handle sending CUSD
  const sendTransaction = async (recipient: string, amount: string) => {
    const amountInCUSD = parseFloat(amount);
    const balanceInCUSD = parseFloat(balance);

    if (amountInCUSD > balanceInCUSD) {
      setErrorMessage('Insufficient balance to complete the transaction.');
      return;
    }

    setSigningLoading(true);
    setErrorMessage(null);

    try {
      const tx = await sendCUSD(recipient, amount);
      setTx(tx);
      const userBalance = await getBalance(address!);
      setBalance(userBalance);
    } catch (error) {
      console.error(error);
    } finally {
      setSigningLoading(false);
    }
  };

  return { address, balance, transactionStatus, tx, errorMessage, signingLoading, sendTransaction };
};
