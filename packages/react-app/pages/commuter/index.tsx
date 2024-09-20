// /* eslint-disable @next/next/no-img-element */
// import { useEffect, useState } from "react";
// import { useQuery } from "@apollo/client"; // Import useQuery from Apollo Client
// import { CommuterUI } from "@/components/CommuterUI";
// import { usePayments } from "@/hooks/usePayment";
// import { useWallet } from "@/hooks/useWallet";
// import { useContractData } from "@/hooks/useContractData";
// import { QRCodeDisplay } from "@/components/QRCodeDisplay";
// import WalletInfo from "@/components/WalletInfo"; // Import the WalletInfo component
// import { Button, Stack } from "@mui/material";
// import QrScanner from "react-qr-scanner";
// import { GET_PAYMENT_DATA } from "@/graphql/queries/getPaymentData"; // Import the GraphQL query
// import TransactionItem from '@/components/TransactionItem';

// export default function CommuterPage() {
//   const {
//     address,
//     getUserAddress,
//     currentWalletAmount,
//     getCurrentWalletAmount,
//   } = useWallet();
//   const { payUser, loading } = usePayments(address);
//   const { getUserBalances } = useContractData();
//   const [recipient, setRecipient] = useState("");
//   const [amount, setAmount] = useState("");
//   const [scanning, setScanning] = useState(false);
//   const [facingMode, setFacingMode] = useState<"user" | "environment">(
//     "environment"
//   );
//   const [showZar, setShowZar] = useState(false);
//   const [conversionRate, setConversionRate] = useState<number | null>(null);

//   // Fetch last 5 transactions
//   const {
//     data,
//     loading: transactionsLoading,
//     error,
//   } = useQuery(GET_PAYMENT_DATA);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       await getUserAddress();
//       if (address) {
//         await getUserBalances(address);
//         await getCurrentWalletAmount(address);
//         fetchConversionRate(); // Fetch conversion rate for ZAR
//       }
//     };
//     fetchUserData();
//   }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount]);

//   const fetchConversionRate = async () => {
//     try {
//       const response = await fetch("https://open.er-api.com/v6/latest/USD");
//       const data = await response.json();
//       const rate = data.rates.ZAR;
//       setConversionRate(rate);
//     } catch (error) {
//       console.error("Error fetching conversion rate:", error);
//     }
//   };

//   const handleScanSuccess = (scannedData: string) => {
//     const { recipient, amount } = JSON.parse(scannedData);
//     setRecipient(recipient);
//     setAmount(amount);
//     setScanning(false);
//   };

//   const handlePay = async () => {
//     await payUser(recipient, amount);
//   };

//   const zarBalance = conversionRate
//     ? (Number(currentWalletAmount) * conversionRate).toFixed(2)
//     : "Loading...";

//   // Filter transactions made by the current user
//   const userTransactions = data?.paymentMades.filter(
//     (transaction: any) =>
//       transaction.payer.toLowerCase() === address?.toLowerCase()
//   );

//   function toggleCamera(
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ): void {
//     throw new Error("Function not implemented.");
//   }

//   return (
//     <div className="flex flex-col items-center bg-black text-white min-h-screen px-4 py-6">
//       {/* Back Button */}
//       <div className="w-full flex items-center mb-4">
//         <button
//           onClick={() => history.back()}
//           className="text-white flex items-center"
//         >
//           <img
//             src="/path-to-back-icon.png"
//             alt="Back"
//             className="w-5 h-5 mr-2"
//           />
//           <span className="text-sm">Back</span>
//         </button>
//       </div>

//       {/* Wallet Info Section */}
//       <WalletInfo
//         address={address}
//         currentWalletAmount={currentWalletAmount}
//         showZar={showZar}
//         zarBalance={zarBalance}
//         setShowZar={setShowZar}
//       />

//       {/* QR Scanner or Pay Button */}
//       {!scanning ? (
//         <>
//           <CommuterUI onScanSuccess={handleScanSuccess} />
//           {recipient && amount && (
//             <div className="mt-6">
//               <button
//                 onClick={handlePay}
//                 disabled={loading}
//                 className={`p-2 rounded-md text-white ${
//                   loading
//                     ? "bg-gray-500 cursor-not-allowed"
//                     : "bg-green-500 hover:bg-green-600"
//                 }`}
//               >
//                 {loading ? "Processing..." : `Pay ${amount} cUSD`}
//               </button>
//               <QRCodeDisplay recipient={recipient} amount={amount} />
//             </div>
//           )}
//         </>
//       ) : (
//         <>
//           <QrScanner
//             delay={10}
//             onError={(err: any) => console.error("QR Scan Error: ", err)}
//             onScan={(data: any) => handleScanSuccess(data.text)}
//             style={{ height: 240, width: "100%" }}
//             facingMode={facingMode}
//           />
//           <Stack
//             direction="row"
//             justifyContent="center"
//             spacing={2}
//             className="mt-2"
//           >
//             <Button variant="contained" color="primary" onClick={toggleCamera}>
//               Switch Camera
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setScanning(false)}
//             >
//               Cancel
//             </Button>
//           </Stack>
//         </>
//       )}

//       {/* Last 5 Transactions */}

//     </div>
//   );
// }


/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client"; // Import useQuery from Apollo Client
import { CommuterUI } from "@/components/CommuterUI";
import { usePayments } from "@/hooks/usePayment";
import { useWallet } from "@/hooks/useWallet";
import { useContractData } from "@/hooks/useContractData";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import WalletInfo from "@/components/WalletInfo"; // Import the WalletInfo component
import { Button, Stack } from "@mui/material";
import QrScanner from "react-qr-scanner";
import { GET_PAYMENT_DATA } from "@/graphql/queries/getPaymentData"; // Import the GraphQL query
import TransactionItem from '@/components/TransactionItem'; // Import the TransactionItem component

export default function CommuterPage() {
  const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
  const { payUser, loading } = usePayments(address);
  const { getUserBalances } = useContractData();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
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
        fetchConversionRate(); // Fetch conversion rate for ZAR
      }
    };
    fetchUserData();
  }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount]);

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
    const { recipient, amount } = JSON.parse(scannedData);
    setRecipient(recipient);
    setAmount(amount);
    setScanning(false);
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
    <div className="flex flex-col items-center bg-black text-white min-h-screen px-4 py-6">
      {/* Back Button */}
      <div className="w-full flex items-center mb-4">
        <button
          onClick={() => history.back()}
          className="text-white flex items-center"
        >
          <img src="/path-to-back-icon.png" alt="Back" className="w-5 h-5 mr-2" />
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
      {!scanning ? (
        <>
          <CommuterUI onScanSuccess={handleScanSuccess} />
          {recipient && amount && (
            <div className="mt-6">
              <button
                onClick={handlePay}
                disabled={loading}
                className={`p-2 rounded-md text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
              >
                {loading ? "Processing..." : `Pay ${amount} cUSD`}
              </button>
              <QRCodeDisplay recipient={recipient} amount={amount} />
            </div>
          )}
        </>
      ) : (
        <>
          <QrScanner
            delay={10}
            onError={(err: any) => console.error("QR Scan Error: ", err)}
            onScan={(data: any) => handleScanSuccess(data.text)}
            style={{ height: 240, width: "100%" }}
            facingMode={facingMode}
          />
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            className="mt-2"
          >
            <Button variant="contained" color="primary" onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}>
              Switch Camera
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setScanning(false)}>
              Cancel
            </Button>
          </Stack>
        </>
      )}

      {/* Last 5 Transactions */}
      <div className="w-full space-y-4 mt-6">
        <h3 className="text-xl font-semibold">Last 5 Transactions</h3>
        {transactionsLoading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p>Error loading transactions: {error.message}</p>
        ) : (
          <div className="bg-gray-800 p-4 rounded-2xl space-y-4">
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
