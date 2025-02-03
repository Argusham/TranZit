/* eslint-disable @next/next/no-img-element */
import blockies from 'ethereum-blockies';
import { useUserRole } from '@/context/UserRoleContext';

interface TransactionItemProps {
  payee: string;
  amount: string;
  blockTimestamp: string;
  showZar: boolean;
  conversionRate: number | null;
}

const TransactionItem = ({ payee, amount, blockTimestamp, showZar, conversionRate }: TransactionItemProps) => {
  const { role } = useUserRole(); 

  const blockieDataUrl = blockies.create({ seed: payee }).toDataURL();
  const formattedAddress = `${payee.substring(0, 5)}...${payee.substring(payee.length - 5)}`;
  const formattedAmount = (Number(amount) / 1e18).toFixed(2);
  const amountZar = conversionRate ? (Number(formattedAmount) * conversionRate).toFixed(2) : "Loading...";
  const formattedDate = new Date(Number(blockTimestamp) * 1000).toLocaleString();

  const isIncome = role === 'driver';

  return (
    <div className="flex items-center justify-between py-4 px-4 border-b last:border-none">
      {/* Left Side: Blockie + Payee Info */}
      <div className="flex items-center space-x-3">
        <img src={blockieDataUrl} alt="Payee Avatar" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-900">{formattedAddress}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Right Side: Amount */}
      <div className="text-right">
        <p className={`text-sm font-semibold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
          {isIncome
            ? `+${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cUSD'}`
            : `-${showZar ? amountZar : formattedAmount} ${showZar ? 'ZAR' : 'cUSD'}`}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
