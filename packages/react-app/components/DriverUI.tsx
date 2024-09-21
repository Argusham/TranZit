
import { useState } from "react";
import { PredefinedAmounts } from "@/components/PredefinedAmounts";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { TextField, Stack } from "@mui/material";


interface DriverUIProps {
  address: string;
  amount: string;
  setAmount: (amount: string) => void;
  predefinedAmounts: number[];
}


export const DriverUI = ({
  address,
  amount,
  setAmount,
  predefinedAmounts,
}: DriverUIProps) => {
  const [isSettingAmount, setIsSettingAmount] = useState(false);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value); // Update immediately when it's a custom input
  };

  const handlePredefinedAmountClick = (amt: number) => {
    setIsSettingAmount(true); // To manage the delay state
    setTimeout(() => {
      setAmount(amt.toString());
      setIsSettingAmount(false); // Reset the delay state after 1 second
    }, 300); // Delay of 1 second
  };


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
        disabled={isSettingAmount} // Disable input when setting predefined amount
      />

      {/* Predefined amount selection */}
      <PredefinedAmounts
        predefinedAmounts={predefinedAmounts}
        handleAmountClick={handlePredefinedAmountClick}
      />

      {/* Automatically Generate QR Code when the driver enters/selects amount */}
      {amount && !isSettingAmount && <QRCodeDisplay recipient={address} amount={amount} />}

    </>
  );
};
