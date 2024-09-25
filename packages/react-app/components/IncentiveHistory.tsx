/* eslint-disable @next/next/no-img-element */
import { useQuery } from "@apollo/client";
import { GET_USER_INCENTIVES } from "@/graphql/queries/getPaymentData"; // Import the new query
import blockies from "ethereum-blockies";

interface IncentiveItemProps {
  user: string;
  amount: string;
}

const IncentiveItem = ({ user, amount }: IncentiveItemProps) => {
  const blockieDataUrl = blockies.create({ seed: user }).toDataURL(); // Generate blockie for the user
  const formattedAddress = `${user.substring(0, 5)}...${user.substring(user.length - 5)}`;
  const formattedAmount = (Number(amount) / 1e18).toFixed(2); // Convert Wei to cUSD

  return (
    <div className="flex justify-between items-center bg-gray-300 p-3 rounded-md mb-2">
      <div className="flex items-center space-x-3">
        <img src={blockieDataUrl} alt="User Avatar" className="w-7 h-7 rounded-full" />
        <p className="text-gray-600">{formattedAddress}</p>
      </div>
      <p className="text-green-400 font-semibold">{formattedAmount} cU$D</p>
    </div>
  );
};

interface IncentiveHistoryProps {
  address: string | null;
}

const IncentiveHistory = ({ address }: IncentiveHistoryProps) => {
  const { data, loading, error } = useQuery(GET_USER_INCENTIVES, {
    variables: { userAddress: address },
  });

  if (loading) return <p>Loading incentive data...</p>;
  if (error) return <p>Error loading incentive data: {error.message}</p>;

  const incentives = data?.incentiveAwardeds || [];

  // Calculate the total incentive amount
  const totalIncentives = incentives.reduce((total: number, incentive: any) => {
    return total + Number(incentive.amount);
  }, 0);

  // Convert total incentives from Wei to cUSD
  const formattedTotalIncentives = (totalIncentives / 1e18).toFixed(2);

  return (
    <div className="w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-opacity-100 p-4 rounded-3xl mb-6 shadow-lg text-white">
      <h3 className="text-lg text-yellow-400 font-semibold mb-4">Incentive History</h3>
      
      {/* Display total incentives */}
      <div className="flex justify-between mb-4">
        <p className="text-sm">Total Incentives Received:</p>
        <span className="font-bold text-yellow-400">{formattedTotalIncentives} cU$D</span>
      </div>

      {/* List each individual incentive */}
      {/* {incentives.length > 0 ? (
        <div>
          {incentives.map((incentive: any) => (
            <IncentiveItem key={incentive.id} user={incentive.user} amount={incentive.amount} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-center">No incentives received yet.</p>
      )} */}
    </div>
  );
};

export default IncentiveHistory;
