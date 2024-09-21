import LandingPage from "./landingpage";

export default function Home() {
  return  (
         <LandingPage />
    );
  
}

// "use client";
// import React, { useEffect, useState } from 'react';
// import { useWallet } from '../hooks/useWallet';
// import { usePayments } from '../hooks/usePayment';
// import { useContractData } from '../hooks/useContractData';
// import { gql, useQuery } from '@apollo/client';

// // GraphQL query to fetch data from your subgraph
// const GET_PAYMENT_DATA = gql`
//   query {
//     incentiveAwardeds(first: 5) {
//       id
//       user
//       amount
//     }
//     paymentMades(first: 10) {
//       id
//       payer
//       payee
//       amount
//     }
//   }
// `;

// const IndexPage = () => {
//   const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
//   const { payUser, loading } = usePayments(address);
//   const {
//     getUserBalances,
//     userBalances,
//     getTaxPercent,
//     getIncentiveAmount,
//     getIncentiveTrigger,
//   } = useContractData();

//   const [recipient, setRecipient] = useState(''); 
//   const [amount, setAmount] = useState(''); 

//   // GraphQL data fetching
//   const { data, loading: graphLoading, error } = useQuery(GET_PAYMENT_DATA);

//   // Fetch user's wallet address, wallet balance, and contract information on mount
//   useEffect(() => {
//     const fetchAddressAndData = async () => {
//       try {
//         await getUserAddress();
//         if (address) {
//           await getUserBalances(address);
//           await getCurrentWalletAmount(address); // Fetch the cUSD balance for the wallet
//         }
//         await getTaxPercent();
//         await getIncentiveAmount();
//         await getIncentiveTrigger();
//       } catch (error) {
//         console.error('Error fetching contract data:', error);
//       }
//     };
//     fetchAddressAndData();
//   }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount, getTaxPercent, getIncentiveAmount, getIncentiveTrigger]);

//   // Handle sending payment
//   const handlePayment = async () => {
//     try {
//       await payUser(recipient, amount);
//       if (address) {
//         await getUserBalances(address);
//         await getCurrentWalletAmount(address); // Update balance after payment
//       }
//     } catch (error) {
//       console.error('Error sending payment:', error);
//     }
//   };


//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">Taxi Payment DApp</h1>

//       {/* Display the current user's address */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Current User Address</h2>
//         <p className="text-gray-600">{address ? address : 'No address connected'}</p>
//       </div>

//       {/* Display the current wallet cUSD balance */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Current Wallet Balance</h2>
//         <p className="text-gray-600">
//           {currentWalletAmount ? `${currentWalletAmount} cUSD` : 'Fetching balance...'}
//         </p>
//       </div>

//       {/* Display the current user's spent and received balances */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Current User Balance</h2>
//         {userBalances ? (
//           <div className="text-gray-600">
//             <p>Balance Spent: {userBalances.balanceSpent} cUSD</p>
//             <p>Balance Received: {userBalances.balanceReceived} cUSD</p>
//           </div>
//         ) : (
//           <p className="text-gray-600">Loading balance...</p>
//         )}
//       </div>

//       {/* Form to send payment */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Send Payment</h2>
//         <div className="flex flex-col space-y-4">
//           <input
//             type="text"
//             placeholder="Recipient Address"
//             value={recipient}
//             onChange={(e) => setRecipient(e.target.value)}
//             className="border border-gray-300 p-2 rounded-md"
//           />
//           <input
//             type="text"
//             placeholder="Amount in cUSD"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="border border-gray-300 p-2 rounded-md"
//           />
//           <button
//             onClick={handlePayment}
//             disabled={loading}
//             className={`p-2 rounded-md text-white ${
//               loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Processing...' : 'Send Payment'}
//           </button>
//         </div>
//       </div>

//       {/* Display data from The Graph */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold">Recent Payments and Incentives</h2>
//         {graphLoading ? (
//           <p>Loading transactions...</p>
//         ) : error ? (
//           <p>Error fetching data: {error.message}</p>
//         ) : (
//           <>
//             <h3 className="text-lg font-semibold">Incentive Awards</h3>
//             <ul className="text-gray-600">
//               {data.incentiveAwardeds.map((award: any) => (
//                 <li key={award.id}>
//                   User: {award.user}, Amount: {award.amount}
//                 </li>
//               ))}
//             </ul>

//             <h3 className="text-lg font-semibold">Payments Made</h3>
//             <ul className="text-gray-600">
//               {data.paymentMades.map((payment: any) => (
//                 <li key={payment.id}>
//                   Payer: {payment.payer}, Payee: {payment.payee}, Amount: {payment.amount}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IndexPage;


