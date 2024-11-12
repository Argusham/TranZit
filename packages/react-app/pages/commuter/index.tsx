import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";
import { CommuterUI } from "@/components/CommuterUI";
import { usePayments } from "@/hooks/usePayment";
import { useWallet } from "@/hooks/useWallet";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";
import { GET_PAYMENT_DATA } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/TransactionItem";
import IncentiveHistory from "@/components/IncentiveHistory";

export default function CommuterPage() {
  const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
  const { payUser, loading } = usePayments(address);
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
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

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
  }, [address, getCurrentWalletAmount, getUserAddress, getUserBalances]);

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
    ? (Number(currentWalletAmount) * conversionRate).toFixed(2)
    : "Loading...";

  const userTransactions = data?.paymentMades
    ?.filter((transaction: any) => transaction.payer.toLowerCase() === address?.toLowerCase())
    .slice(-5);

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-4 py-6 bg-gray-100">
      {/* Back Button */}
      <div className="w-full flex items-center mb-6">
        <button
          onClick={() => history.back()}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Tab Navigation with pill-shaped design */}
      <div className="w-full max-w-md mb-6">
        <div className="flex bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "wallet" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "rewards" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Rewards
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "activity" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Wallet and QR Scanner Section */}
      {activeTab === "wallet" && (
        <>
          <WalletInfo
            address={address}
            currentWalletAmount={currentWalletAmount}
            showZar={showZar}
            zarBalance={zarBalance}
            setShowZar={setShowZar}
          />
          <CommuterUI onScanSuccess={handleScanSuccess} />
          {recipient && amount && !isProcessingComplete && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex space-x-4">
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className={`w-1/2 p-3 rounded-lg font-semibold text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 transition duration-200"
                  }`}
                >
                  {loading ? "Processing..." : `Pay ${amount} cUSD`}
                </button>
                {!isProcessing && (
                  <button
                    onClick={handleCancelTransaction}
                    className="w-1/2 p-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-200"
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
      {activeTab === "rewards" && address && (
        <IncentiveHistory
          address={address}
          showZar={showZar}
          conversionRate={conversionRate}
        />
      )}

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Previous Transactions</h3>
            <button
              onClick={handleRefresh}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="w-5 h-5" />
            </button>
          </div>

          {transactionsLoading ? (
            <p className="text-center text-gray-500">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error loading transactions: {error.message}</p>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-md space-y-4 mt-4">
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
