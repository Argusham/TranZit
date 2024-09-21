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

  return (
    <div className="flex justify-between items-center bg-gray-600 p-3 rounded-md">
      <div className="flex items-center space-x-3">
        {/* Display blockie */}
        <img src={blockieDataUrl} alt="Payee Avatar" className="w-6 h-6 rounded-full" />
        {/* Display formatted payee address */}
        <p>{formattedAddress}</p>
      </div>
      {/* Display formatted amount */}
      <p className="font-semibold">{formattedAmount} cUSD</p>
    </div>
  );
};

export default TransactionItem;
