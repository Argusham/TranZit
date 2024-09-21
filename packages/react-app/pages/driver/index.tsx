// /* eslint-disable @next/next/no-img-element */
// import { useState } from "react";
// import { useRouter } from "next/router"; // Import useRouter for navigation
// import { DriverUI } from "@/components/DriverUI";
// import { TransactionStatus } from "@/components/TransactionStatus";


// export default function DriverUIPage() {
//   const router = useRouter(); // Initialize router
//   const [amount, setAmount] = useState<string>(""); // Amount for QR code and transactions
//   const predefinedAmounts = [1, 2, 0.5]; // Predefined amounts for the driver
 

//   const goBack = () => {
//     router.back(); // Navigate to the previous page
//   };

//   const transactions = [
//     {
//       id: 1,
//       name: "Michael Davis",
//       date: "October 5, 2023",
//       amount: 220,
//       avatar: "/path-to-avatar1.jpg",
//       type: "positive",
//     },
//     {
//       id: 2,
//       name: "Richard Taylor",
//       date: "October 3, 2023",
//       amount: -8,
//       avatar: "/path-to-avatar2.jpg",
//       type: "negative",
//     },
//     {
//       id: 3,
//       name: "Thomas Harris",
//       date: "October 2, 2023",
//       amount: 10,
//       avatar: "/path-to-avatar3.jpg",
//       type: "positive",
//     },
//   ];

//   return (
//     <div className="flex flex-col items-center bg-black text-white min-h-screen px-4 py-6">
//       {/* Back Button */}
//       <div className="w-full flex items-center mb-4">
//         <button onClick={goBack} className="text-white flex items-center">
//           <img
//             src="/path-to-back-icon.png"
//             alt="Back"
//             className="w-5 h-5 mr-2"
//           />
//           <span className="text-sm">Back</span>
//         </button>
//       </div>

//       {/* Profile Section */}
//       <div className="w-full bg-green-600 p-4 rounded-2xl mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-lg">Hello Driver👋</p>
//             <h2 className="text-sm font-bold">{address}</h2>
//           </div>
//         </div>
//         <div className="mt-4">
//           <p className="text-sm">Your Current Balance</p>
//           <h3 className="text-4xl font-bold">cU$D {balance}</h3>
//         </div>
//       </div>

//       {/* Driver-specific UI for amount and QR code generation */}
//       <div className="w-full bg-green-600 p-4 rounded-2xl mb-6">
//         <DriverUI
//           amount={amount}
//           setAmount={setAmount}
//           predefinedAmounts={predefinedAmounts}
//           transactionStatus={transactionStatus}
//           address={address || ""}
//         />

//         {/* Transaction Status */}
//         <TransactionStatus status={transactionStatus} />
//       </div>

//       {/* Transactions Section */}
//       <div className="w-full bg-gray-900 p-6 rounded-2xl">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-bold text-lg">Transactions</h3>
//           <span className="text-sm text-gray-400">See All</span>
//         </div>
//         <div className="space-y-4">
//           {transactions.map((transaction) => (
//             <div
//               key={transaction.id}
//               className="flex justify-between items-center"
//             >
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={transaction.avatar}
//                   alt={transaction.name}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div>
//                   <p className="font-bold">{transaction.name}</p>
//                   <p className="text-sm text-gray-400">{transaction.date}</p>
//                 </div>
//               </div>
//               <p
//                 className={`font-bold ${
//                   transaction.type === "positive"
//                     ? "text-green-400"
//                     : "text-red-400"
//                 }`}
//               >
//                 {transaction.type === "positive" ? "+" : ""}$
//                 {transaction.amount.toFixed(2)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { DriverUI } from '@/components/DriverUI';
import { usePayments } from '@/hooks/usePayment';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';

export default function DriverPage() {
  const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
  const { payUser, loading } = usePayments(address);
  const { getUserBalances, userBalances } = useContractData();
  const [amount, setAmount] = useState('');
  const predefinedAmounts = [0.5, 1, 1.5, 2];

  useEffect(() => {
    const fetchUserData = async () => {
      await getUserAddress();
      if (address) {
        await getUserBalances(address);
        await getCurrentWalletAmount(address);
      }
    };
    fetchUserData();
  }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount]);

  const handlePayment = async (recipient: string, amount: string) => {
    await payUser(recipient, amount);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Driver - Generate Payment QR</h1>

      {/* Display current wallet balance */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Current Wallet Balance</h2>
        <p>{currentWalletAmount ? `${currentWalletAmount} cUSD` : 'Fetching balance...'}</p>
      </div>

      <DriverUI
        address={address || ""}
        amount={amount}
        setAmount={setAmount}
        predefinedAmounts={predefinedAmounts}
      />
    </div>
  );
}
