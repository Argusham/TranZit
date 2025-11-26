/* eslint-disable @next/next/no-img-element */
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useUserRole } from '@/context/UserRoleContext';

interface TransactionItemProps {
  driver: string;
  amount: string;
  blockTimestamp: string;
  showZar: boolean;
  conversionRate: number | null;
}

const TransactionItem = ({ driver, amount, blockTimestamp, showZar, conversionRate }: TransactionItemProps) => {
  const { role } = useUserRole();

  // Shorten the driver address for display
  const formattedAddress = `${driver.substring(0, 4)}...${driver.substring(driver.length - 4)}`;
  const formattedAmount = (Number(amount) / 1e18).toFixed(2);
  const amountZar = conversionRate ? (Number(formattedAmount) * conversionRate).toFixed(2) : "Loading...";

  // Format the timestamp into a Date object and then into a cleaner date and time
  const date = new Date(Number(blockTimestamp) * 1000);
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  const isIncome = role === 'driver';

  return (
    <div className="flex items-center justify-between py-4 px-4 border-b last:border-none">
      <div className="flex items-center space-x-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
          {isIncome ? (
            <ArrowDownIcon className="w-5 h-5 text-green-500" />
          ) : (
            <ArrowUpIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-900">{formattedAddress}</p>
          <p className="text-xs text-gray-500">
            {formattedTime} • {formattedDate}
          </p>
        </div>
      </div>

    
      <div className="text-right">
        <p className={`text-sm font-semibold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
          {isIncome
            ? `+${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cU$D'}`
            : `-${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cU$D'}`}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
