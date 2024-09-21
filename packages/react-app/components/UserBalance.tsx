interface UserBalanceProps {
    userBalances: { balanceSpent: string; balanceReceived: string } | null;
  }
  
  const UserBalance = ({ userBalances }: UserBalanceProps) => {
    return (
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
    );
  };
  
  export default UserBalance;
  