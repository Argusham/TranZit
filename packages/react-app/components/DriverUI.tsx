// // components/DriverUI.tsx
// import { useState } from "react";
// import { PredefinedAmounts } from "@/components/PredefinedAmounts";
// import { QRCodeDisplay } from "@/components/QRCodeDisplay";
// import { TransactionStatus } from "@/components/TransactionStatus";
// import { GasInfo } from "@/components/GasInfo";
// import { TextField, Stack } from "@mui/material";

// interface DriverUIProps {
//   address: string;
//   amount: string;
//   setAmount: (amount: string) => void;
//   predefinedAmounts: number[];
//   transactionStatus: string | null;
//   gasEstimate: string | null;
//   gasPrice: string | null;
// }

// export const DriverUI = ({
//   address,
//   amount,
//   setAmount,
//   predefinedAmounts,
//   transactionStatus,
//   gasEstimate,
//   gasPrice,
// }: DriverUIProps) => {
//   const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setAmount(e.target.value);
//   };

//   return (
//     <>
//       {/* Driver UI for entering a custom amount */}
//       <TextField
//         id="custom-amount"
//         label="Enter fair amount"
//         variant="outlined"
//         value={amount}
//         fullWidth
//         onChange={handleCustomAmountChange}
//         className="mb-3"
//       />

//       {/* Predefined amount selection */}
//       <PredefinedAmounts
//         predefinedAmounts={predefinedAmounts}
//         handleAmountClick={(amt) => setAmount(amt.toString())}
//       />

//       {/* Automatically Generate QR Code when the driver enters/selects amount */}
//       {amount && <QRCodeDisplay recipient={address} amount={amount} />}

//       {/* Transaction Status */}
//       <TransactionStatus status={transactionStatus} />

//       {/* Gas Information */}
//       <GasInfo gasEstimate={gasEstimate} gasPrice={gasPrice} />
//     </>
//   );
// };



import { PredefinedAmounts } from '@/components/PredefinedAmounts';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { TextField } from '@mui/material';
import { usePayments } from '@/hooks/usePayment'; // Import new hook

interface DriverUIProps {
  address: string;
  amount: string;
  setAmount: (amount: string) => void;
  predefinedAmounts: number[];
}

export const DriverUI = ({ address, amount, setAmount, predefinedAmounts }: DriverUIProps) => {
  const { payUser, loading } = usePayments(address); // Use new hook for payments

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  return (
    <>
      <TextField
        id="custom-amount"
        label="Enter fare amount"
        variant="outlined"
        value={amount}
        fullWidth
        onChange={handleCustomAmountChange}
        className="mb-3"
      />

      <PredefinedAmounts predefinedAmounts={predefinedAmounts} handleAmountClick={(amt) => setAmount(amt.toString())} />

      {amount && <QRCodeDisplay recipient={address} amount={amount} />}

     
    </>
  );
};
