// components/TransactionStatus.tsx
import { Typography } from '@mui/material';

interface TransactionStatusProps {
  status: string | null;
}

export const TransactionStatus = ({ status }: TransactionStatusProps) => (
  <>{status && <Typography className='font-bold mt-4'>Transaction: {status}</Typography>}</>
);
