// import { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
// import { useQuery } from "@apollo/client";
// import { ProcessPayment } from "@/components/ProcessPayment";
// import { usePayments } from "@/hooks/usePayment";
// import WalletInfo from "@/components/WalletInfo";
// import { GET_PAYMENT_SENT } from "@/graphql/queries/getPaymentData";
// import TransactionItem from "@/components/TransactionItem";
// import IncentiveHistory from "@/components/IncentiveHistory";
// import { useWallets } from "@/context/WalletProvider";
// import FonbnkWidget from "@/components/FonbnkWidget";

// export default function CommuterPage() {
//   const { walletAddress, walletBalance, fetchWalletBalance } = useWallets();
//   const { payUser, loading } = usePayments(walletAddress);
//   const [recipient, setRecipient] = useState("");
//   const [amount, setAmount] = useState("");
//   const [showZar, setShowZar] = useState(false);
//   const [conversionRate, setConversionRate] = useState<number | null>(null);
//   const [isProcessingComplete, setIsProcessingComplete] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Toggle state to switch between Wallet, Rewards, and Activity views
//   const [activeTab, setActiveTab] = useState("wallet");

//   const {
//     data,
//     loading: transactionsLoading,
//     error,
//     refetch,
//   } = useQuery(GET_PAYMENT_SENT, {
//     fetchPolicy: "network-only",
//     notifyOnNetworkStatusChange: true,
//   });

//   useEffect(() => {
//     fetchWalletBalance(); // Ensure wallet balance is fetched
//     fetchConversionRate();
//   }, [fetchWalletBalance]);

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
//       if (parsedData.recipient && parsedData.amount) {
//         setRecipient(parsedData.recipient);
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
//     setIsProcessing(true);
//     try {
//       await payUser(recipient, amount);
//       setIsProcessingComplete(true);
//       await refetch();
//     } catch (error) {
//       console.error("Payment failed:", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
//   const handleCancelTransaction = () => {
//     setRecipient("");
//     setAmount("");
//     setIsProcessingComplete(false);
//     setIsProcessing(false);
//   };

//   const zarBalance = conversionRate
//     ? (Number(walletBalance) * conversionRate).toFixed(2)
//     : "Loading...";

//   const userTransactions = data?.paymentMades
//     ?.filter(
//       (transaction: any) =>
//         transaction.payer.toLowerCase() === walletAddress?.toLowerCase()
//     )
//     .slice(-5);

//   const handleRefresh = async () => {
//     await fetchWalletBalance();
//     await refetch();
//   };

//   return (
//     <div className="flex flex-col items-center text-gray-800 min-h-screen px-6 py-8 bg-gray-100">
//       {/* Back Button */}
//       <div className="w-full flex items-center mb-8">
//         <button
//           onClick={() => history.back()}
//           className="flex items-center text-gray-500 hover:text-gray-700 transition duration-200"
//         >
//           <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 mr-2" />
//           <span className="text-sm font-medium">Back</span>
//         </button>
//       </div>

//       {/* Tab Navigation */}
//       <div className="w-full max-w-md mb-8">
//         <div className="flex bg-gray-200 rounded-full p-1 space-x-1">
//           {["wallet", "activity", "TopUp"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-2 text-center rounded-full ${
//                 activeTab === tab
//                   ? "bg-white text-blue-600 font-semibold"
//                   : "text-gray-500"
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Wallet Section */}
//       {activeTab === "wallet" && (
//         <>
//           <WalletInfo
//             showZar={showZar}
//             zarBalance={zarBalance}
//             setShowZar={setShowZar}
//           />
//           <div className="w-full max-w-md mt-6 mb-6">
//             <ProcessPayment onScanSuccess={handleScanSuccess} />
//           </div>
//           {recipient && amount && !isProcessingComplete && (
//           <div className="mt-6 w-full max-w-md">
//             <div className="flex space-x-4">
//               <button
//                 onClick={handlePay}
//                 disabled={loading}
//                 className={`w-1/2 py-3 rounded-lg font-semibold text-white ${
//                   loading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-green-500 hover:bg-green-600 transition duration-200"
//                 }`}
//               >
//                 {loading ? "Processing..." : `Pay ${amount} cUSD`}
//               </button>
//               {!isProcessing && (
//                 <button
//                   onClick={handleCancelTransaction}
//                   className="w-1/2 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-200"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//         </>
//       )}

//       {/* Activity Section (Merged Rewards and Transactions) */}
//       {activeTab === "activity" && (
//         <div className="w-full max-w-md mx-auto mt-6">
//           {/* Incentive Section */}
//           {walletAddress && (
//             <IncentiveHistory
//               address={walletAddress}
//               showZar={showZar}
//               conversionRate={conversionRate}
//             />
//           )}

//           {/* Transactions Section */}
//           <div className="bg-white p-4 rounded-2xl shadow-sm mt-6">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Transactions
//               </h3>
//             </div>

//             {transactionsLoading ? (
//               <p className="text-center text-gray-500 py-4">
//                 Loading transactions...
//               </p>
//             ) : error ? (
//               <p className="text-center text-red-500 py-4">
//                 Error loading transactions: {error.message}
//               </p>
//             ) : (
//               <div>
//                 {userTransactions.length > 0 ? (
//                   userTransactions
//                     .slice(0, 5)
//                     .map((transaction: any) => (
//                       <TransactionItem
//                         key={transaction.id}
//                         payee={transaction.payee}
//                         amount={transaction.amount}
//                         blockTimestamp={transaction.blockTimestamp}
//                         showZar={showZar}
//                         conversionRate={conversionRate}
//                       />
//                     ))
//                 ) : (
//                   <p className="text-center text-gray-500 py-4">
//                     No recent transactions found.
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Refresh Button */}
//             <button
//               onClick={handleRefresh}
//               className="w-full flex items-center justify-center text-gray-600 text-sm mt-4"
//             >
//               <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4 mr-2" />
//               Refresh Transactions
//             </button>
//           </div>
//         </div>
//       )}

//         {/* Transact Section (Fonbnk Integration) */}
//         {activeTab === "TopUp" && (
//         <div className="w-full max-w-md">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Top up your balance
//           </h3>
//           <FonbnkWidget />
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";
import { ProcessPayment } from "@/components/ui/ProcessPayment";
import { usePayments } from "@/hooks/usePayment";
import WalletInfo from "@/components/ui/WalletInfo";
import { GET_PAYMENT_SENT } from "@/graphql/queries/getPaymentData";
import TransactionItem from "@/components/ui/TransactionItem";
import IncentiveHistory from "@/components/ui/IncentiveHistory";
import { useWallets } from "@/context/WalletProvider"; // ✅ Updated import
import FonbnkWidget from "@/components/FonbnkWidget";

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
  } = useQuery(GET_PAYMENT_SENT, {
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
                    payee={transaction.payee}
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
    </div>
  );
}
