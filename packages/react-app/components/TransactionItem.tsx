/* eslint-disable @next/next/no-img-element */
import blockies from 'ethereum-blockies';
import { useUserRole } from '@/context/UserRoleContext'; // Import the user role context

interface TransactionItemProps {
  payee: string;
  amount: string;
  blockTimestamp: string;
  showZar: boolean;
  conversionRate: number | null;
}

const TransactionItem = ({ payee, amount, blockTimestamp, showZar, conversionRate }: TransactionItemProps) => {
  const { role } = useUserRole(); // Get the user's role (driver or commuter)

  const blockieDataUrl = blockies.create({ seed: payee }).toDataURL(); // Generate blockie for payee
  const formattedAddress = `${payee.substring(0, 5)}...${payee.substring(payee.length - 5)}`;
  const formattedAmount = (Number(amount) / 1e18).toFixed(2); // Convert Wei to cUSD
  const amountZar = conversionRate ? (Number(formattedAmount) * conversionRate).toFixed(2) : "Loading...";

  // Format the blockTimestamp to a human-readable format
  const formattedDate = new Date(Number(blockTimestamp) * 1000).toLocaleString();

  // Determine if it's income or a transfer based on the user role
  const isIncome = role === 'driver';

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
    {/* Left side: Blockie and Payee Info */}
    <div className="flex items-center space-x-3">
      <img src={blockieDataUrl} alt="Payee Avatar" className="w-8 h-8 rounded-full border border-gray-300" />
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-800">{formattedAddress}</p>
        <p className="text-xs text-gray-500">{formattedDate}</p>
      </div>
    </div>

    {/* Right side: Amount and Transaction Type */}
    <div className="text-right">
      <p className={`font-semibold text-sm ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
        {isIncome
          ? `+${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cU$D'}`
          : `-${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cU$D'}`}
      </p>
      <p className="text-xs text-gray-500">{isIncome ? 'Income' : 'Transfer'}</p>
    </div>
  </div>
  );
};

export default TransactionItem;
