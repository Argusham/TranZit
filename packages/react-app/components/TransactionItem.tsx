/* eslint-disable @next/next/no-img-element */
// components/TransactionItem.tsx
import blockies from 'ethereum-blockies'; // For generating blockie images

interface TransactionItemProps {
  payee: string;
  amount: string;
}

const TransactionItem = ({ payee, amount }: TransactionItemProps) => {
  const blockieDataUrl = blockies.create({ seed: payee }).toDataURL(); // Generate blockie for payee
  const formattedAddress = `${payee.substring(0, 5)}...${payee.substring(payee.length - 5)}`;
  const formattedAmount = (Number(amount) / 1e18).toFixed(2); // Convert Wei to cUSD
  const isIncome = Number(formattedAmount) > 0; 

  return (
    // <div className="flex justify-between items-center bg-gray-600 p-3 rounded-md">
    //   <div className="flex items-center space-x-3">
    //     {/* Display blockie */}
    //     <img src={blockieDataUrl} alt="Payee Avatar" className="w-6 h-6 rounded-full" />
    //     {/* Display formatted payee address */}
    //     <p>{formattedAddress}</p>
    //   </div>
    //   {/* Display formatted amount */}
    //   <p className="font-semibold">{formattedAmount} cUSD</p>
    // </div>
    <div className="flex justify-between items-center bg-gray-600 p-3 rounded-md">
    {/* Left side: Blockie and Payee Info */}
    <div className="flex items-center space-x-3">
      {/* Display blockie */}
      <img src={blockieDataUrl} alt="Payee Avatar" className="w-6 h-6 rounded-full" />
      <div className="flex flex-col">
        {/* Display formatted payee address */}
        <p className="text-white">{formattedAddress}</p>
        {/* Static transaction date */}
        <p className="text-xs text-gray-400">Today, 10:12</p> {/* Fixed date */}
      </div>
    </div>

    {/* Right side: Amount and Transaction Type */}
    <div className="text-right">
      {/* Display formatted amount with color based on transfer type */}
      <p className={`font-semibold text-sm ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
        {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`} cUSD
      </p>
      {/* Static transaction type */}
      <p className="text-xs text-gray-400">{isIncome ? 'Income' : 'Transfer'}</p> {/* Fixed transaction type */}
    </div>
  </div>
  );
};

export default TransactionItem;
