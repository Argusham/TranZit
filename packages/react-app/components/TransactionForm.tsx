// components/TransactionForm.tsx
import { TextField } from '@mui/material';

interface TransactionFormProps {
  recipient: string;
  amount: string;
  setRecipient: (recipient: string) => void;
  setAmount: (amount: string) => void;
}

export const TransactionForm = ({ recipient, amount, setRecipient, setAmount }: TransactionFormProps) => (
  <>
    <div className='mb-3'>
      <TextField
        id='outlined-basic'
        label='Recipient Address'
        variant='outlined'
        value={recipient}
        fullWidth
        onChange={(e) => setRecipient(e.target.value)}
      />
    </div>
    <div className='mb-3'>
      <TextField
        id='outlined-basic'
        label='Amount'
        variant='outlined'
        value={amount}
        fullWidth
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
  </>
);
