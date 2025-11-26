import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ProcessPayment } from "@/components/ui/ProcessPayment";
import { usePayments } from "@/hooks/usePayment";
import WalletInfo from "@/components/ui/WalletInfo";
import { GET_PAYMENT_MADE } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/ui/TransactionItem";
import IncentiveHistory from "@/components/ui/IncentiveHistory";
import { useWallets } from "@/context/WalletProvider"; // ✅ Updated import
import FonbnkWidget from "@/components/FonbnkWidget";
import TabNavigation from "@/components/ui/TabNavigation";

export default function CommuterPage() {
  // ✅ Updated: Using the new WalletProvider values
  const { address, balance, } = useWallets();
  const { payUser, isLoading } = usePayments();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Toggle state to switch between Wallet, Rewards, and Activity views
  const [activeTab, setActiveTab] = useState("wallet");

  const {
    data,
    loading: transactionsLoading,
    error,
    refetch,
  } = useQuery(GET_PAYMENT_MADE, {
    variables: { address: address },
    skip: !address,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (address) {
      fetchConversionRate();
    }
  }, [address]);

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
    if (!address) {
      console.error("No wallet connected.");
      return;
    }

    setIsProcessing(true);
    try {
      await payUser({
        recipient,
        amount,
        tokenAddress: "0x765de816845861e75A25fCA122bb6898B8B1282a", // ✅ cUSD contract address on Celo
      });

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
    ? (Number(balance) * conversionRate).toFixed(2)
    : "Loading...";

  const userTransactions = data?.paymentMades
    ?.filter(
      (transaction: any) =>
        transaction.payer.toLowerCase() === address?.toLowerCase()
    )
    .slice(-5);

  const handleRefresh = async () => {
    await refetch();
  };

  const commuterTabs = [
    { id: "wallet", label: "Wallet" },
    { id: "activity", label: "Activity" },
    { id: "TopUp", label: "Top Up" },
  ];

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 pb-28 bg-gray-100 relative">
      {/* Content Area */}

      {/* Wallet Section */}
      {activeTab === "wallet" && (
        <>
          <WalletInfo
            showZar={showZar}
            zarBalance={zarBalance}
            setShowZar={setShowZar}
          />
          <div className="w-full max-w-md mt-6 mb-6">
            <ProcessPayment onScanSuccess={handleScanSuccess} />
          </div>
          {recipient && amount && !isProcessingComplete && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex space-x-4">
                <button
                  onClick={handlePay}
                  disabled={isLoading}
                  className={`w-1/2 py-3 rounded-lg font-semibold text-white ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 transition duration-200"
                  }`}
                >
                  {isLoading ? "Processing..." : `Pay ${amount} cUSD`}
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

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="w-full max-w-md mx-auto mt-6 space-y-6">
          {/* Incentive History */}
          {address && (
            <div className="bg-white border border-[#E5E5EA] rounded-3xl p-4">
              <p className="text-xs font-medium text-[#8E8E93] uppercase tracking-wide mb-1">
                Incentives
              </p>
              <IncentiveHistory
                address={address}
                showZar={showZar}
                conversionRate={conversionRate}
              />
            </div>
          )}

          {/* Wallet Activity */}
          <div className="bg-white border border-[#E5E5EA] rounded-3xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-[#1C1C1E]">
                Wallet Activity
              </h3>
            </div>

            {transactionsLoading ? (
              <p className="text-center text-sm text-[#8E8E93] py-4">
                Loading transactions...
              </p>
            ) : error ? (
              <p className="text-center text-sm text-red-500 py-4">
                Error loading transactions: {error.message}
              </p>
            ) : userTransactions.length > 0 ? (
              <div className="space-y-4">
                {userTransactions.slice(0, 5).map((transaction: any) => (
                  <TransactionItem
                    key={transaction.id}
                    driver={transaction.driver}
                    amount={transaction.amount}
                    blockTimestamp={transaction.blockTimestamp}
                    showZar={showZar}
                    conversionRate={conversionRate}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-[#8E8E93] py-4">
                No recent transactions found.
              </p>
            )}

            {/* Refresh CTA */}
            <div className="pt-4 mt-4 border-t border-[#E5E5EA]">
              <button
                onClick={handleRefresh}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-[#007AFF] border border-[#007AFF] rounded-xl hover:bg-[#F2F2F7] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#007AFF"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v6h6M20 20v-6h-6M4 20l16-16"
                  />
                </svg>
                Refresh Transactions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TopUp Section */}
      {activeTab === "TopUp" && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top up your balance
          </h3>
          <FonbnkWidget />
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={() => history.back()}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-full shadow-inner hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <TabNavigation
            tabs={commuterTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className=""
          />
        </div>
      </div>
    </div>
  );
}