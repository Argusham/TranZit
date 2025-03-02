/* eslint-disable react-hooks/exhaustive-deps */

// import { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
// import { useQuery } from "@apollo/client";
// import { ProcessPayment } from "@/components/ProcessPayment";
// import { usePayments } from "@/hooks/usePayment";
// import { useContractData } from "@/hooks/useContractData";
// import WalletInfo from "@/components/WalletInfo";
// import { GET_PAYMENT_SENT } from "@/graphql/queries/getPaymentData";
// import TransactionItem from "@/components/TransactionItem";
// import IncentiveHistory from "@/components/IncentiveHistory";
// import { useWallets } from "@privy-io/react-auth"; // ✅ Fetch wallet from Privy
// import FonbnkWidget from "@/components/FonbnkWidget";
// import { Address, isAddress } from "viem"; // ✅ Import Address type and validation

// export default function CommuterPage() {
//   const { wallets } = useWallets();
//   const activeWallet = wallets.length > 0 ? wallets[0] : null; // ✅ Use first available wallet
//   const walletAddress = activeWallet?.address as Address | null;

//   const { payUser, loading } = usePayments(); // ✅ Uses updated hook
//   const { getUserBalances } = useContractData();

//   const [recipient, setRecipient] = useState<Address | "">(""); // ✅ Ensure recipient is a valid Address
//   const [amount, setAmount] = useState<string>("");
//   const [showZar, setShowZar] = useState(false);
//   const [conversionRate, setConversionRate] = useState<number | null>(null);
//   const [isProcessingComplete, setIsProcessingComplete] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [activeTab, setActiveTab] = useState("wallet"); // Toggle state for the tabs

//   useEffect(() => {
//     if (walletAddress) {
//       getUserBalances(walletAddress);
//       fetchConversionRate();
//     }
//   }, [walletAddress]);

//   const fetchConversionRate = async () => {
//     try {
//       const response = await fetch("https://open.er-api.com/v6/latest/USD");
//       const data = await response.json();
//       setConversionRate(data.rates.ZAR);
//     } catch (error) {
//       console.error("Error fetching conversion rate:", error);
//     }
//   };

//   const handleScanSuccess = (scannedData: string) => {
//     try {
//       const parsedData = JSON.parse(scannedData);
//       if (parsedData.recipient && isAddress(parsedData.recipient)) {
//         setRecipient(parsedData.recipient as Address);
//         setAmount(parsedData.amount);
//         setIsProcessingComplete(false);
//       } else {
//         console.warn("Invalid QR code format.");
//       }
//     } catch (error) {
//       console.error("Error parsing scanned data:", error);
//     }
//   };

//   const handlePay = async () => {
//     if (!isAddress(recipient)) {
//       console.error("❌ Invalid recipient address.");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       await payUser(recipient, amount);
//       setIsProcessingComplete(true);
//     } catch (error) {
//       console.error("Payment failed:", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
//       {/* ✅ Only show wallet when connected */}
//       {walletAddress ? (
//         <>
//           <WalletInfo showZar={showZar} zarBalance={null} setShowZar={function (value: boolean): void {
//             throw new Error("Function not implemented.");
//           } } />
//           <ProcessPayment onScanSuccess={handleScanSuccess} />
//           <button onClick={handlePay} disabled={loading}>
//             {loading ? "Processing..." : `Pay ${amount} cUSD`}
//           </button>
//         </>
//       ) : (
//         <p>❌ Please connect your wallet.</p>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";
import { ProcessPayment } from "@/components/ProcessPayment";
import { usePayments } from "@/hooks/usePayment";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";
import { GET_PAYMENT_SENT } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/TransactionItem";
import IncentiveHistory from "@/components/IncentiveHistory";
import { useWalletsContext } from "@/context/WalletProvider";
import FonbnkWidget from "@/components/FonbnkWidget";
import { Address, isAddress } from "viem";

export default function CommuterPage() {
  // const walletAddress = activeWallet?.address as Address | null;
  const { walletAddress, walletBalance, fetchWalletBalance } =
    useWalletsContext();

  const { payUser, loading } = usePayments();
  const { getUserBalances } = useContractData();

  const [recipient, setRecipient] = useState<Address | "">("");
  const [amount, setAmount] = useState<string>("");
  const [showZar, setShowZar] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("wallet");

  const {
    data,
    loading: transactionsLoading,
    error,
    refetch,
  } = useQuery(GET_PAYMENT_SENT, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (walletAddress) {
      // getUserBalances(walletAddress);
      fetchWalletBalance();
      fetchConversionRate();
    }
  }, [walletAddress]);

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

  const handleScanSuccess = (scannedData: string) => {
    try {
      const parsedData = JSON.parse(scannedData);
      if (parsedData.recipient && isAddress(parsedData.recipient)) {
        setRecipient(parsedData.recipient as Address);
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
    if (!isAddress(recipient)) {
      console.error("❌ Invalid recipient address.");
      return;
    }
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

  const handleRefresh = async () => {
    await refetch();
  };

  const userTransactions = data?.paymentMades
    ?.filter(
      (transaction: any) =>
        transaction.payer.toLowerCase() === walletAddress?.toLowerCase()
    )
    .slice(-5);

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
          {["wallet", "activity", "TopUp"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center rounded-full ${
                activeTab === tab
                  ? "bg-white text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Section */}
      {activeTab === "wallet" && walletAddress && (
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
                  disabled={loading}
                  className={`w-1/2 py-3 rounded-lg font-semibold text-white ${
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
      {activeTab === "activity" && walletAddress && (
        <div className="w-full max-w-md mx-auto mt-6">
          <IncentiveHistory
            address={walletAddress}
            showZar={showZar}
            conversionRate={conversionRate}
          />
          <div className="bg-white p-4 rounded-2xl shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions
            </h3>
            {transactionsLoading ? (
              <p className="text-center text-gray-500 py-4">
                Loading transactions...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 py-4">
                Error: {error.message}
              </p>
            ) : (
              <div>
                {userTransactions.length > 0 ? (
                  userTransactions.map((transaction: any) => (
                    <TransactionItem
                      key={transaction.id}
                      {...transaction}
                      showZar={showZar}
                      conversionRate={conversionRate}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No recent transactions found.
                  </p>
                )}
              </div>
            )}
            <button
              onClick={handleRefresh}
              className="w-full flex items-center justify-center text-gray-600 text-sm mt-4"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4 mr-2" />
              Refresh Transactions
            </button>
          </div>
        </div>
      )}

      {/* TopUp Section */}
      {activeTab === "TopUp" && <FonbnkWidget />}
    </div>
  );
}
