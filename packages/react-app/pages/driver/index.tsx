// /* eslint-disable @next/next/no-img-element */
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { DriverUI } from "@/components/DriverUI";
// import { gql, useQuery } from "@apollo/client";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
// import { useWallet } from "@/hooks/useWallet";
// import { useContractData } from "@/hooks/useContractData";


// const GET_PAYMENT_DATA = gql`
//   query GetPaymentData($address: String!) {
//     incentiveAwardeds(first: 5) {
//       id
//       user
//       amount
//     }
//     paymentMades(where: { payer: $address }) {
//       id
//       payer
//       payee
//       amount
//     }
//   }
// `;

// const GET_USER_BALANCE = gql`
//   query GetUserBalances($address: Bytes!) {
//     userBalance(id: $address) {
//       balanceSpent
//       balanceReceived
//     }
//   }
// `;

// export default function DriverUIPage() {
//   const router = useRouter();
//   const [amount, setAmount] = useState<string>("");
//   const predefinedAmounts = [1, 2, 0.5];
//   const { getUserBalances, userBalances } = useContractData();
//   const [isMounted, setIsMounted] = useState(false);
//   const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
//   // const address = "0xb11";

//   const goBack = () => {
//     router.back();
//   };

//   const { data, loading: graphLoading, error } = useQuery(GET_PAYMENT_DATA, {
//     variables: { address },
//     skip: !address,
//   });

//   const result = useQuery(GET_USER_BALANCE, {
//     variables: { address },
//     skip: !address,
//   });


//   useEffect(() => {
//     setIsMounted(true);

//     const fetchUserData = async () => {
//       await getUserAddress();
//       if (address) {
//         await getUserBalances(address);
//         await getCurrentWalletAmount(address);
//       }
//     };
    
//     fetchUserData();
//   }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount])

//   return (
//     <div className="flex flex-col items-center bg-white text-black min-h-screen px-6 py-8">
//       {/* Back Button */}
//       <div className="w-full flex items-center mb-4">
//         <button
//           onClick={goBack}
//           className="flex items-center text-black hover:opacity-80 transition"
//         >
//           <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
//           <span className="text-sm font-medium">Back</span>
//         </button>
//       </div>

//       {/* Profile Section */}
//       <div className="w-full bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-3xl mb-6 shadow-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-xl font-semibold text-white">Hi, Driver 👋</p>
//             <h2 className="text-sm font-bold text-gray-200 mt-1 break-all">
//               {address}
//             </h2>
//           </div>
//           <div>
//             <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-white" />
//           </div>
//         </div>
//         <div className="mt-6">
//           <p className="text-sm text-gray-200">Wallet Balance</p>
//           <h3 className="text-5xl font-extrabold text-white mt-2">cU$D {userBalances?.balanceReceived}</h3>
//         </div>
//         {/* <div className="flex justify-between mt-6">
//           <button className="bg-white text-green-600 px-6 py-2 rounded-full shadow-md hover:scale-105 transition">Send</button>
//           <button className="bg-green-700 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition">Request</button>
//         </div> */}
//       </div>

//       {/* Driver-specific UI */}
//       <div className="w-full bg-gray-100 p-6 rounded-3xl mb-6 shadow-lg">
//         <DriverUI
//           amount={amount}
//           setAmount={setAmount}
//           predefinedAmounts={predefinedAmounts}
//           address={address || ""}
//         />
//         {/* Transaction Status */}
//         {/* <TransactionStatus status={transactionStatus} /> */}
//       </div>

//       {/* Transactions Section */}
//       <div className="w-full bg-gray-100 p-6 rounded-3xl shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="font-bold text-lg text-black">Recent Activity</h3>
//           <span className="text-sm text-gray-400 cursor-pointer hover:underline">
//             See All
//           </span>
//         </div>
//         <div className="space-y-4">
//           {data?.paymentMades.map((transaction: any) => (
//             <div
//               key={transaction?.id}
//               className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
//             >
//               <div className="flex items-center space-x-4">
//                 <FontAwesomeIcon icon={faUserCircle} className="w-12 h-12 text-gray-500" />
//                 <div>
//                   <p className="font-semibold text-black">{transaction?.name}</p>
//                   <p className="text-sm text-gray-400">{transaction?.date}</p>
//                 </div>
//               </div>
//               <p
//                 className={`font-bold text-xl ${
//                   transaction?.type === "positive"
//                     ? "text-green-500"
//                     : "text-red-500"
//                 }`}
//               >
//                 {transaction?.type === "positive" ? "+" : "-"}$
//                 {Number.parseInt(transaction?.amount) * Math.pow(10, -18)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DriverUI } from "@/components/DriverUI";
import { gql, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "@/hooks/useWallet";
import { useContractData } from "@/hooks/useContractData";
import WalletInfo from "@/components/WalletInfo";

const GET_PAYMENT_DATA = gql`
  query GetPaymentData($address: String!) {
    incentiveAwardeds(first: 5) {
      id
      user
      amount
    }
    paymentMades(where: { payer: $address }) {
      id
      payer
      payee
      amount
    }
  }
`;

const GET_USER_BALANCE = gql`
  query GetUserBalances($address: Bytes!) {
    userBalance(id: $address) {
      balanceSpent
      balanceReceived
    }
  }
`;

export default function DriverUIPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const predefinedAmounts = [1, 2, 0.5];
  const { getUserBalances, userBalances } = useContractData();
  const [isMounted, setIsMounted] = useState(false);
  const { address, getUserAddress, currentWalletAmount, getCurrentWalletAmount } = useWallet();
  const [showZar, setShowZar] = useState(false); // State for toggling ZAR display
  const [conversionRate, setConversionRate] = useState<number | null>(null); // Conversion rate for ZAR

  const goBack = () => {
    router.back();
  };

  const { data, loading: graphLoading, error } = useQuery(GET_PAYMENT_DATA, {
    variables: { address },
    skip: !address,
  });

  const result = useQuery(GET_USER_BALANCE, {
    variables: { address },
    skip: !address,
  });

  useEffect(() => {
    setIsMounted(true);

    const fetchUserData = async () => {
      await getUserAddress();
      if (address) {
        await getUserBalances(address);
        await getCurrentWalletAmount(address);
        fetchConversionRate();
      }
    };

    fetchUserData();
  }, [address, getUserAddress, getUserBalances, getCurrentWalletAmount]);

  // Fetching conversion rate for ZAR
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

  const zarBalance = conversionRate
    ? (Number(currentWalletAmount) * conversionRate).toFixed(2)
    : "Loading...";

  return (
    <div className="flex flex-col items-center bg-white text-black min-h-screen px-6 py-8">
      {/* Back Button */}
      <div className="w-full flex items-center mb-4">
        <button onClick={goBack} className="flex items-center text-black hover:opacity-80 transition">
          <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Wallet Info Section */}
      <WalletInfo
        address={address}
        currentWalletAmount={currentWalletAmount}
        showZar={showZar} // Pass the toggle state
        zarBalance={zarBalance} // Pass the ZAR balance
        setShowZar={setShowZar} // Pass the function to toggle ZAR
      />

      {/* Driver-specific UI */}
      <div className="w-full bg-gray-100 p-6 rounded-3xl mb-6 shadow-lg">
        <DriverUI amount={amount} setAmount={setAmount} predefinedAmounts={predefinedAmounts} address={address || ""} />
      </div>

      {/* Transactions Section */}
      <div className="w-full bg-gray-100 p-6 rounded-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-black">Recent Activity</h3>
          <span className="text-sm text-gray-400 cursor-pointer hover:underline">See All</span>
        </div>
        <div className="space-y-4">
          {data?.paymentMades.map((transaction: any) => (
            <div key={transaction?.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faUserCircle} className="w-12 h-12 text-gray-500" />
                <div>
                  <p className="font-semibold text-black">{transaction?.payee}</p>
                  <p className="text-sm text-gray-400">{transaction?.date}</p>
                </div>
              </div>
              <p className={`font-bold text-xl ${transaction?.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                {transaction?.amount > 0 ? "+" : "-"}$
                {(Number(transaction?.amount) * Math.pow(10, -18)).toFixed(2)} {/* Amount converted from wei */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
