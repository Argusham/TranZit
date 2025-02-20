import { useState } from "react";
import { PredefinedAmounts } from "@/components/PredefinedAmounts";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

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

  // Ensure the QR code always gets cUSD, even if user inputs ZAR
  const qrAmount = showZar
    ? (Number(amount) / conversionRate).toFixed(2)
    : amount;

  return (
    <div className="w-full max-w-md mx-auto bg-white p-2 rounded-lg">
      {/* Input Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium text-sm mb-2">
          Enter fare amount ({showZar ? "ZAR" : "cUSD"})
        </label>
        <input
          type="number"
          value={amount}
          onChange={handleCustomAmountChange}
          disabled={isSettingAmount}
          placeholder={`Enter fare in ${showZar ? "ZAR" : "cUSD"}`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Predefined Amounts or Loading Spinner */}
      {isSettingAmount ? (
        <div className="flex justify-center my-4"></div>
      ) : (
        <PredefinedAmounts
          predefinedAmounts={predefinedAmounts}
          handleAmountClick={handlePredefinedAmountClick}
          conversionRate={conversionRate || 1}
          showZar={showZar}
        />
      )}

      {/* QR Code Display - Always in cUSD */}
      {amount && !isSettingAmount && (
        <div className="mt-6">
          <QRCodeDisplay recipient={address} amount={qrAmount} />
          <p className="text-center text-gray-500 text-sm mt-2">
            {showZar ? `Converted to ${qrAmount} cUSD` : "Processing in cUSD"}
          </p>
        </div>
      )}
    </div>
  );
};
