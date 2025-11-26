/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReceivePayment } from "@/components/ui/ReceivePayment";
import WalletInfo from "@/components/ui/WalletInfo";
import { GET_PAYMENTS_RECEIVED } from "@/graphql/queries/getPaymentData";
import { useQuery } from "@apollo/client";
import { useWallets } from "@/context/WalletProvider";
import IncentiveHistory from "@/components/ui/IncentiveHistory";
import TransactionItem from "@/components/ui/TransactionItem";
import FonbnkWidget from "@/components/FonbnkWidget";
import TabNavigation from "@/components/ui/TabNavigation";
import AIPage from "@/components/AIPage";
import { Sparkles } from "lucide-react";

export default function DriverUIPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const predefinedAmounts = [0.5, 1, 2];
  const { address, balance } = useWallets();
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("wallet"); // Toggle state for the tabs

  const goBack = () => {
    router.back();
  };

  const {
    data,
    loading: transactionsLoading,
    error,
    refetch,
  } = useQuery(GET_PAYMENTS_RECEIVED, {
    variables: { address: address },
    // skip: !walletAddress,
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

  const zarBalance = conversionRate
    ? (Number(balance) * conversionRate).toFixed(2)
    : "Loading...";

  const handleRefresh = async () => {
    await refetch();
  };

  const driverTabs = [
    { id: "wallet", label: "Wallet" },
    { id: "activity", label: "Activity" },
    { id: "withdraw", label: "Withdraw" },
    { id: "ai", label: "AI", icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 pb-32 bg-gray-100 relative">
      {/* Content Area */}

      {activeTab === "wallet" && (
        <>
          <WalletInfo
            showZar={showZar}
            zarBalance={zarBalance}
            setShowZar={setShowZar}
          />
          <div className="w-full bg-white p-4 rounded-lg mt-4">
            <ReceivePayment
              amount={amount}
              setAmount={setAmount}
              predefinedAmounts={predefinedAmounts}
              address={address || ""}
              conversionRate={conversionRate || 1}
              showZar={showZar}
            />
          </div>
        </>
      )}

      {activeTab === "activity" && (
        <div className="w-full max-w-md mx-auto mt-6">
          <div className="bg-white border border-[#E5E5EA] rounded-3xl p-5">
            {/* Header */}
            <div className="mb-4">
              <p className="text-xs font-medium text-[#8E8E93] uppercase tracking-wide mb-1">
                Transactions
              </p>
              <h3 className="text-xl font-bold text-[#1C1C1E]">
                Recent Activity
              </h3>
            </div>

            {/* Incentive History */}
            {address && (
              <div className="mb-4">
                <IncentiveHistory
                  address={address}
                  showZar={showZar}
                  conversionRate={conversionRate}
                />
              </div>
            )}

            {/* Transaction Feed */}
            <div className="border-t border-[#E5E5EA] pt-4">
              {transactionsLoading ? (
                <p className="text-center text-sm text-[#8E8E93] py-6">
                  Loading transactions...
                </p>
              ) : error ? (
                <p className="text-center text-sm text-red-500 py-6">
                  Error loading transactions: {error.message}
                </p>
              ) : data?.paymentMades?.length > 0 ? (
                <div className="space-y-4">
                  {data.paymentMades.map((transaction: any) => (
                    <TransactionItem
                      key={transaction?.id}
                      driver={transaction?.driver}
                      amount={transaction?.amount}
                      blockTimestamp={transaction?.blockTimestamp}
                      showZar={showZar}
                      conversionRate={conversionRate}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-[#8E8E93] py-6">
                  No recent transactions found.
                </p>
              )}
            </div>

            {/* Refresh Button */}
            <div className="mt-6 border-t border-[#E5E5EA] pt-4">
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

      {activeTab === "withdraw" && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Withdraw Funds
          </h3>
          <FonbnkWidget />
        </div>
      )}

      {/* AI Section */}
      {activeTab === "ai" && (
        <div className="w-full max-w-md h-[calc(100vh-200px)]">
          <AIPage />
        </div>
      )}

      {/* Fixed Bottom Navigation - Floating */}
      <div className="fixed bottom-6 left-0 right-0 px-4 sm:px-6 z-50">
        <div className="max-w-md mx-auto bg-white rounded-full shadow-2xl p-2 flex items-center gap-2 border border-gray-100">
          <button
            type="button"
            onClick={goBack}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105"
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
            tabs={driverTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}