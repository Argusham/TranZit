/* eslint-disable @next/next/no-img-element */
// // components/TransactionItem.tsx
// import blockies from 'ethereum-blockies'; // For generating blockie images

// interface TransactionItemProps {
//   payee: string;
//   amount: string;
//   blockTimestamp: string;  // Add timestamp prop
// }

// const TransactionItem = ({ payee, amount, blockTimestamp }: TransactionItemProps) => {
//   const blockieDataUrl = blockies.create({ seed: payee }).toDataURL(); // Generate blockie for payee
//   const formattedAddress = `${payee.substring(0, 5)}...${payee.substring(payee.length - 5)}`;
//   const formattedAmount = (Number(amount) / 1e18).toFixed(2); // Convert Wei to cUSD
//   const isIncome = Number(formattedAmount) > 0;

//   // Format the timestamp to a human-readable format
//   const formattedDate = new Date(Number(blockTimestamp) * 1000).toLocaleString();

//   return (
//     <div className="flex justify-between items-center bg-gray-600 p-3 rounded-md">
//       {/* Left side: Blockie and Payee Info */}
//       <div className="flex items-center space-x-3">
//         {/* Display blockie */}
//         <img src={blockieDataUrl} alt="Payee Avatar" className="w-6 h-6 rounded-full" />
//         <div className="flex flex-col">
//           {/* Display formatted payee address */}
//           <p className="text-white">{formattedAddress}</p>
//           {/* Display the transaction date */}
//           <p className="text-xs text-gray-400">{formattedDate}</p>
//         </div>
//       </div>

//       {/* Right side: Amount and Transaction Type */}
//       <div className="text-right">
//         {/* Display formatted amount with color based on transfer type */}
//         <p className={`font-semibold text-sm ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
//           {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`} cUSD
//         </p>
//         {/* Static transaction type */}
//         <p className="text-xs text-gray-400">{isIncome ? 'Income' : 'Transfer'}</p>
//       </div>
//     </div>
//   );
// };

// export default TransactionItem;


import blockies from 'ethereum-blockies';
import { useUserRole } from '@/context/UserRoleContext'; // Import the user role context

interface TransactionItemProps {
  payee: string;
  amount: string;
  blockTimestamp: string;
}

const TransactionItem = ({ payee, amount, blockTimestamp }: TransactionItemProps) => {
  const { role } = useUserRole(); // Get the user's role (driver or commuter)

  const blockieDataUrl = blockies.create({ seed: payee }).toDataURL(); // Generate blockie for payee
  const formattedAddress = `${payee.substring(0, 5)}...${payee.substring(payee.length - 5)}`;
  const formattedAmount = (Number(amount) / 1e18).toFixed(2); // Convert Wei to cUSD

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
          {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`} cU$D
        </p>
        {/* Transaction type based on role */}
        <p className="text-xs text-gray-600">{isIncome ? 'Income' : 'Transfer'}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
