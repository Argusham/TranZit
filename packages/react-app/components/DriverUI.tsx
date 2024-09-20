import { PredefinedAmounts } from '@/components/PredefinedAmounts';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { TextField } from '@mui/material';

interface DriverUIProps {
  address: string;
  amount: string;
  setAmount: (amount: string) => void;
  predefinedAmounts: number[];
}

export const DriverUI = ({ address, amount, setAmount, predefinedAmounts }: DriverUIProps) => {

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
