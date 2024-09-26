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
    <div className="flex justify-between items-center bg-gray-300 p-3 rounded-md">
      {/* Left side: Blockie and Payee Info */}
      <div className="flex items-center space-x-3">
        {/* Display blockie */}
        <img src={blockieDataUrl} alt="Payee Avatar" className="w-7 h-7 rounded-full" />
        <div className="flex flex-col">
          {/* Display formatted payee address */}
          <p className="text-gray-600">{formattedAddress}</p>
          {/* Display the transaction date */}
          <p className="text-xs text-gray-600">{formattedDate}</p>
        </div>
      </div>

      {/* Right side: Amount and Transaction Type */}
      <div className="text-right">
        {/* Display formatted amount with color based on role */}
        <p className={`font-semibold text-sm ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
        {isIncome
            ? `+${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cU$D'}`
            : `-${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cU$D'}`}
        </p>
        {/* Transaction type based on role */}
        <p className="text-xs text-gray-600">{isIncome ? 'Income' : 'Transfer'}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
