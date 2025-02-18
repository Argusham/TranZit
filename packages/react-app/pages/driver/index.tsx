/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReceivePayment } from "@/components/ReceivePayment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";
import { GET_PAYMENTS_RECEIVED } from "@/graphql/queries/getPaymentData";
import { useQuery } from "@apollo/client";
import { useWallets } from "@/context/WalletProvider";

export default function DriverUIPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const predefinedAmounts = [0.5, 1, 2];

  const { walletAddress, walletBalance, fetchWalletBalance } = useWallets();
  const { getUserBalances } = useContractData();
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("wallet"); // Toggle state for the tabs

  const goBack = () => {
    router.back();
  };

  const { data, loading: graphLoading, error } = useQuery(GET_PAYMENTS_RECEIVED, {
    variables: { address: walletAddress },
    skip: !walletAddress,
  });

  useEffect(() => {
    fetchWalletBalance();
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

  const zarBalance = conversionRate
    ? (Number(walletBalance) * conversionRate).toFixed(2)
    : "Loading...";

  return (
    <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
      {/* Back Button */}
      <div className="w-full flex items-center mb-6">
        <button
          onClick={goBack}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Toggle Tabs */}
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
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 text-center rounded-full ${
              activeTab === "activity" ? "bg-white text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Wallet and DriverUI Section */}
      {activeTab === "wallet" && (
        <>
          <WalletInfo
            showZar={showZar}
            zarBalance={zarBalance}
            setShowZar={setShowZar}
          />

          {/* Driver-specific UI */}
          <div className="w-full bg-white p-4 rounded-lg mt-4">
            <ReceivePayment
              amount={amount}
              setAmount={setAmount}
              predefinedAmounts={predefinedAmounts}
              address={walletAddress || ""}
              conversionRate={conversionRate || 1}
              showZar={showZar}
            />
          </div>
        </>
      )}

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="w-full max-w-md bg-white p-4 rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
          {graphLoading ? (
            <p className="text-center text-gray-500">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error loading transactions: {error.message}</p>
          ) : (
            <div className="space-y-4">
              {data?.paymentMades.map((transaction: any) => (
                <div
                  key={transaction?.id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="w-10 h-10 text-blue-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {`${transaction?.payer.substring(0, 5)}...${transaction?.payer.substring(transaction?.payee.length - 5)}`}
                      </p>
                      <p className="text-xs text-gray-500">{transaction?.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${transaction?.type === "positive" ? "text-green-600" : "text-red-600"}`}>
                    {transaction?.type === "positive" ? "+" : "-"}$
                    {(Number(transaction?.amount) / 1e18).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
