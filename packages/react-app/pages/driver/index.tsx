/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReceivePayment } from "@/components/ui/ReceivePayment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import WalletInfo from "@/components/ui/WalletInfo";
import { GET_PAYMENTS_RECEIVED } from "@/graphql/queries/getPaymentData";
import { useQuery } from "@apollo/client";
import { useWallets } from "@/context/WalletProvider";
import IncentiveHistory from "@/components/ui/IncentiveHistory";
import TransactionItem from "@/components/ui/TransactionItem";
import FonbnkWidget from "@/components/FonbnkWidget";

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

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
      <div className="w-full flex items-center mb-6">
        <button
          onClick={goBack}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="w-full max-w-md mb-6">
        <div className="flex bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "wallet"
                ? "bg-white text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "activity"
                ? "bg-white text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "withdraw"
                ? "bg-white text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Withdraw
          </button>
        </div>
      </div>

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
    </div>
  );
}