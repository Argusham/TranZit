import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";
import { CommuterUI } from "@/components/CommuterUI";
import { usePayments } from "@/hooks/usePayment";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";
import { GET_PAYMENT_DATA } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/TransactionItem";
import IncentiveHistory from "@/components/IncentiveHistory";
import { useWallets } from "@/context/WalletProvider";

export default function CommuterPage() {
  const { walletAddress, walletBalance, fetchWalletBalance } = useWallets();
  const { payUser, loading } = usePayments(walletAddress);
  const { getUserBalances } = useContractData();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Toggle state to switch between Wallet, Rewards, and Activity views
  const [activeTab, setActiveTab] = useState("wallet");

  const { data, loading: transactionsLoading, error, refetch } = useQuery(GET_PAYMENT_DATA, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    fetchWalletBalance(); // Ensure wallet balance is fetched
    fetchConversionRate();
  }, [fetchWalletBalance]);

  const fetchConversionRate = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      setConversionRate(data.rates.ZAR);
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
        setIsProcessingComplete(false);
      } else {
        console.warn("Invalid QR code format.");
      }
    } catch (error) {
      console.error("Error parsing scanned data:", error);
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await payUser(recipient, amount);
      setIsProcessingComplete(true);
      await refetch();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelTransaction = () => {
    setRecipient("");
    setAmount("");
    setIsProcessingComplete(false);
    setIsProcessing(false);
  };

  const zarBalance = conversionRate
    ? (Number(walletBalance) * conversionRate).toFixed(2)
    : "Loading...";

  const userTransactions = data?.paymentMades
    ?.filter((transaction: any) => transaction.payer.toLowerCase() === walletAddress?.toLowerCase())
    .slice(-5);

  const handleRefresh = async () => {
    await fetchWalletBalance();
    await refetch();
  };

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
      {/* Back Button */}
      <div className="w-full flex items-center mb-8">
        <button
          onClick={() => history.back()}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="w-full max-w-md mb-8">
        <div className="flex bg-gray-200 rounded-full p-1 space-x-1">
          {["wallet", "rewards", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center rounded-full ${
                activeTab === tab ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet and QR Scanner Section */}
      {activeTab === "wallet" && (
        <>
          <WalletInfo showZar={showZar} zarBalance={zarBalance} setShowZar={setShowZar} />
          <div className="w-full max-w-md mt-6 mb-6">
            <CommuterUI onScanSuccess={handleScanSuccess} />
          </div>
          {recipient && amount && !isProcessingComplete && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex space-x-4">
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className={`w-1/2 py-3 rounded-lg font-semibold text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 transition duration-200"
                  }`}
                >
                  {loading ? "Processing..." : `Pay ${amount} cUSD`}
                </button>
                {!isProcessing && (
                  <button
                    onClick={handleCancelTransaction}
                    className="w-1/2 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Rewards Section */}
      {activeTab === "rewards" && walletAddress && (
        <IncentiveHistory address={walletAddress} showZar={showZar} conversionRate={conversionRate} />
      )}

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="w-full max-w-md mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Previous Transactions</h3>
            <button
              onClick={handleRefresh}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="w-5 h-5" />
            </button>
          </div>

          {transactionsLoading ? (
            <p className="text-center text-gray-500 mt-4">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4">Error loading transactions: {error.message}</p>
          ) : (
            <div className="bg-white p-6 rounded-lg space-y-4 mt-4">
              {userTransactions.length > 0 ? (
                userTransactions.map((transaction: any) => (
                  <TransactionItem
                    key={transaction.id}
                    payee={transaction.payee}
                    amount={transaction.amount}
                    blockTimestamp={transaction.blockTimestamp}
                    showZar={showZar}
                    conversionRate={conversionRate}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">No recent transactions found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
