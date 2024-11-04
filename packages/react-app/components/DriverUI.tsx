
import { useState } from "react";
import { PredefinedAmounts } from "@/components/PredefinedAmounts";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { TextField, Stack } from "@mui/material";


interface DriverUIProps {
  address: string;
  amount: string;
  setAmount: (amount: string) => void;
  predefinedAmounts: number[];
  conversionRate: number;
  showZar: boolean;
}


export const DriverUI = ({
  address,
  amount,
  setAmount,
  predefinedAmounts,
  conversionRate,
  showZar
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
        label={`Enter fare amount (${showZar ? 'ZAR' : 'cUSD'})`}
        variant="outlined"
        value={amount}
        fullWidth
        onChange={handleCustomAmountChange}
        disabled={isSettingAmount} // Disable input when setting predefined amount
        className="mb-3"
        InputProps={{
          style: {
            color: '#000000', // text-yellow-400 equivalent for value text
            borderColor: '#000000', // text-yellow-400 equivalent for border color
          },
          classes: {
            notchedOutline: 'border-yellow-400', // Apply yellow border to the outline
          },
        }}
        InputLabelProps={{
          style: {
            color: '#facc15', // text-yellow-400 equivalent for label text
          },
        }}
        placeholder="Enter fare amount"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000', // yellow border
            },
            '&:hover fieldset': {
              borderColor: '#000000', // yellow border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000', // yellow border when focused
            },
          },
          '& .MuiInputBase-input': {
            color: '#000000', // yellow text color for input
          },
          '& .MuiInputLabel-root': {
            color: '#000000', // yellow color for label
          },
        }}
      />

      {/* Predefined amount selection */}
      <PredefinedAmounts
        predefinedAmounts={predefinedAmounts}
        handleAmountClick={handlePredefinedAmountClick}
        conversionRate={conversionRate || 1}
        showZar={showZar}
      />

      {/* Automatically Generate QR Code when the driver enters/selects amount */}
      {amount && !isSettingAmount && <QRCodeDisplay recipient={address} amount={amount} />}

    </>
  );
};
