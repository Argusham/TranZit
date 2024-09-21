/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from "@apollo/client";
import { CommuterUI } from "@/components/CommuterUI";
import { usePayments } from "@/hooks/usePayment";
import { useWallet } from "@/hooks/useWallet";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";
import { GET_PAYMENT_DATA } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/TransactionItem";

export default function CommuterPage() {
  const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
  const { payUser, loading } = usePayments(address);
  const { getUserBalances } = useContractData();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  // Fetch last 5 transactions
  const { data, loading: transactionsLoading, error } = useQuery(GET_PAYMENT_DATA);

  useEffect(() => {
    const fetchUserData = async () => {
      await getUserAddress();
      if (address) {
        await getUserBalances(address);
        await getCurrentWalletAmount(address);
        fetchConversionRate();
      }
    };
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const fetchConversionRate = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      const rate = data.rates.ZAR;
      setConversionRate(rate);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    }
  };

  const handleScanSuccess = (scannedData: string) => {
    try {
      const parsedData = JSON.parse(scannedData);
      if (parsedData.recipient && parsedData.amount) {
        setRecipient(parsedData.recipient);
        setAmount(parsedData.amount);
      } else {
        console.warn("Invalid QR code format.");
      }
    } catch (error) {
      console.error("Error parsing scanned data:", error);
    }
  };

  const handlePay = async () => {
    await payUser(recipient, amount);
  };

  const zarBalance = conversionRate
    ? (Number(currentWalletAmount) * conversionRate).toFixed(2)
    : "Loading...";

  // Filter transactions made by the current user
  const userTransactions = data?.paymentMades.filter(
    (transaction: any) =>
      transaction.payer.toLowerCase() === address?.toLowerCase()
  );

  return (
    <div className="flex flex-col items-center text-white min-h-screen px-4 py-6">
      {/* Back Button */}
      <div className="w-full text-black flex items-center mb-4">
        <button
          onClick={() => history.back()}
          className="flex items-center"
        >
           <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Wallet Info Section */}
      <WalletInfo
        address={address}
        currentWalletAmount={currentWalletAmount}
        showZar={showZar}
        zarBalance={zarBalance}
        setShowZar={setShowZar}
      />

      {/* QR Scanner or Pay Button */}
      <CommuterUI onScanSuccess={handleScanSuccess} />
      {recipient && amount && (
        <div className="mt-6 w-full max-w-md">
          <button
            onClick={handlePay}
            disabled={loading}
            className={`w-full p-2 rounded-md text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Processing..." : `Pay ${amount} cUSD`}
          </button>
        </div>
      )}

      {/* Last 5 Transactions */}
      <div className="w-full max-w-md space-y-4 mt-6">
        <h3 className="text-xl text-black font-semibold">Last 5 Transactions</h3>
        {transactionsLoading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p>Error loading transactions: {error.message}</p>
        ) : (
          <div className="bg-gray-400 p-4 rounded-2xl space-y-4">
            {userTransactions.length > 0 ? (
              userTransactions.map((transaction: any) => (
                <TransactionItem
                  key={transaction.id}
                  payee={transaction.payee}
                  amount={transaction.amount}
                />
              ))
            ) : (
              <p>No recent transactions found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}