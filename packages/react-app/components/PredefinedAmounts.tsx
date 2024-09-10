// components/PredefinedAmounts.tsx
import { Button } from '@mui/material';

interface PredefinedAmountsProps {
  predefinedAmounts: number[];
  handleAmountClick: (amount: number) => void;
}

export const PredefinedAmounts = ({ predefinedAmounts, handleAmountClick }: PredefinedAmountsProps) => (
  <div className='flex flex-row justify-center space-x-2 mb-4'>
    {predefinedAmounts.map((amount) => (
      <Button key={amount} variant='outlined' onClick={() => handleAmountClick(amount)}>
        {amount} cUSD
      </Button>
    ))}
  </div>
);
