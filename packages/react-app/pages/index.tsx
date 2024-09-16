// import LandingPage from "./landingpage";

// export default function Home() {
//   return  (
//          <LandingPage />
//     );
  
// }

import React, { useEffect, useState } from 'react';
import { useTaxiPayment } from '../hooks/useTaxiPayment';

const IndexPage = () => {
  const {
    address,
    getUserAddress,
    payUser,
    getUserBalances,
    userBalances,
    getTaxPercent,
    taxPercent,
    getIncentiveAmount,
    incentiveAmount,
    getIncentiveTrigger,
    incentiveTrigger,
    loading,
  } = useTaxiPayment();

  const [recipient, setRecipient] = useState(''); // For sending payment
  const [amount, setAmount] = useState('0'); // For amount input
  const [userAddress, setUserAddress] = useState(''); // For manually fetching user balance

  // Fetch user's wallet address and contract information on mount
  useEffect(() => {
    const fetchAddressAndData = async () => {
      await getUserAddress();
      if (address) {
        await getUserBalances(address); // Automatically fetch current user's balance
      }
      await getTaxPercent();
      await getIncentiveAmount();
      await getIncentiveTrigger();
    };
    fetchAddressAndData();
  }, [address, getUserAddress, getUserBalances, getTaxPercent, getIncentiveAmount, getIncentiveTrigger]);

  // Handle sending payment
  const handlePayment = async () => {
    await payUser(recipient, amount);
  };

  // Handle manually fetching another user's balance
  const handleGetBalances = async () => {
    await getUserBalances(userAddress);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Taxi Payment DApp</h1>

      {/* Display the current user's address */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Current User Address</h2>
        <p className="text-gray-600">{address ? address : 'No address connected'}</p>
      </div>

      {/* Display the current user's balance */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Current User Balance</h2>
        {userBalances ? (
          <div className="text-gray-600">
            <p>Balance Spent: {userBalances.balanceSpent} cUSD</p>
            <p>Balance Received: {userBalances.balanceReceived} cUSD</p>
          </div>
        ) : (
          <p className="text-gray-600">Loading balance...</p>
        )}
      </div>

      {/* Form to send payment */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Send Payment</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Amount in cUSD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`p-2 rounded-md text-white ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Send Payment'}
          </button>
        </div>
      </div>

      {/* Form to manually fetch user balances */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Get User Balances</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="User Address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <button
            onClick={handleGetBalances}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Get Balances
          </button>

          {userBalances && (
            <div className="text-gray-600">
              <p>Balance Spent: {userBalances.balanceSpent} cUSD</p>
              <p>Balance Received: {userBalances.balanceReceived} cUSD</p>
            </div>
          )}
        </div>
      </div>

      {/* Display contract information */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Contract Information</h2>
        <div className="text-gray-600">
          <p>Tax Percent: {taxPercent}%</p>
          <p>Incentive Amount: {incentiveAmount} cUSD</p>
          <p>Incentive Trigger: {incentiveTrigger} unique interactions</p>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
