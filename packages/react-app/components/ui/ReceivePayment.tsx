// import { useState } from "react";
// import { PredefinedAmounts } from "@/components/ui/PredefinedAmounts";
// import { QRCodeDisplay } from "@/components/ui/QRCodeDisplay";

// interface DriverUIProps {
//   address: string;
//   amount: string;
//   setAmount: (amount: string) => void;
//   predefinedAmounts: number[];
//   conversionRate: number;
//   showZar: boolean;
// }

// export const ReceivePayment = ({
//   address,
//   amount,
//   setAmount,
//   predefinedAmounts,
//   conversionRate,
//   showZar,
// }: DriverUIProps) => {
//   const [isSettingAmount, setIsSettingAmount] = useState(false);
//   const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

//   const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setAmount(e.target.value);
//     setSelectedAmount(null);
//   };

//   const handlePredefinedAmountClick = (amt: number) => {
//     setIsSettingAmount(true);
//     setSelectedAmount(amt);
//     setTimeout(() => {
//       setAmount(amt.toString());
//       setIsSettingAmount(false);
//     }, 300);
//   };

//   // Ensure the QR code always gets cUSD, even if user inputs ZAR
//   const qrAmount = showZar
//     ? (Number(amount) / conversionRate).toFixed(2)
//     : amount;

//   return (
//     <div className="w-full max-w-md mx-auto bg-white p-2 rounded-lg">
//       {/* Input Field */}
//       <div className="mb-4">
//         <label className="block text-gray-700 font-medium text-sm mb-2">
//           Fare amount ({showZar ? "ZAR" : "cU$D"})
//         </label>
//         <input
//           type="number"
//           value={amount}
//           onChange={handleCustomAmountChange}
//           disabled={isSettingAmount}
//           placeholder={`Enter fare in ${showZar ? "ZAR" : "cUSD"}`}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//         />
//       </div>

//       {/* Predefined Amounts or Loading Spinner */}
//       {isSettingAmount ? (
//         <div className="flex justify-center my-4"></div>
//       ) : (
//         <PredefinedAmounts
//           predefinedAmounts={predefinedAmounts}
//           handleAmountClick={handlePredefinedAmountClick}
//           conversionRate={conversionRate || 1}
//           showZar={showZar}
//         />
//       )}

//       {/* QR Code Display - Always in cUSD */}
//       {amount && !isSettingAmount && (
//         <div className="mt-6">
//           <QRCodeDisplay recipient={address} amount={qrAmount} />
//           <p className="text-center text-gray-500 text-sm mt-2">
//             {showZar ? `Converted to ${qrAmount} cUSD` : "Processing in cUSD"}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { PredefinedAmounts } from "@/components/ui/PredefinedAmounts";
import { QRCodeDisplay } from "@/components/ui/QRCodeDisplay";

interface DriverUIProps {
  address: string;
  amount: string;
  setAmount: (amount: string) => void;
  predefinedAmounts: number[];
  conversionRate: number;
  showZar: boolean;
}

export const ReceivePayment = ({
  address,
  amount,
  setAmount,
  predefinedAmounts,
  conversionRate,
  showZar,
}: DriverUIProps) => {
  const [isSettingAmount, setIsSettingAmount] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handlePredefinedAmountClick = (amt: number) => {
    setIsSettingAmount(true);
    setSelectedAmount(amt);
    setTimeout(() => {
      setAmount(amt.toString());
      setIsSettingAmount(false);
    }, 300);
  };

  const qrAmount = showZar ? (Number(amount) / conversionRate).toFixed(2) : amount;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#E5E5EA]">
        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#8E8E93] mb-2">
            Fare amount ({showZar ? "ZAR" : "cU$D"})
          </label>
          <input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            value={amount}
            onChange={handleCustomAmountChange}
            disabled={isSettingAmount}
            placeholder={`Enter fare in ${showZar ? "ZAR" : "cUSD"}`}
            className="w-full p-3 text-sm rounded-xl border border-[#D1D1D6] bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-[#1C1C1E] placeholder:text-[#A1A1AA]"
          />
        </div>

        {/* Predefined Amounts */}
        {isSettingAmount ? (
          <div className="flex justify-center my-4 animate-pulse">
            <span className="text-sm text-[#8E8E93]">Setting amount...</span>
          </div>
        ) : (
          <PredefinedAmounts
            predefinedAmounts={predefinedAmounts}
            handleAmountClick={handlePredefinedAmountClick}
            conversionRate={conversionRate || 1}
            showZar={showZar}
          />
        )}

        {/* QR Code Display */}
        {amount && !isSettingAmount && (
          <div className="mt-6 flex flex-col items-center justify-center">
            <QRCodeDisplay recipient={address} amount={qrAmount} />
            {/* Optionally, you can show the converted amount */}
            {/* <p className="text-sm text-[#8E8E93] mt-2">
              {showZar ? `Converted to ${qrAmount} cUSD` : "Processing in cUSD"}
            </p> */}
          </div>
        )}
      </div>
    </div>
  );
};