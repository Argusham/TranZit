// components/QRCodeDisplay.tsx
import QRCode from 'react-qr-code';
import { Typography } from '@mui/material';

interface QRCodeDisplayProps {
  recipient: string;
  amount: string;
}

export const QRCodeDisplay = ({ recipient, amount }: QRCodeDisplayProps) => (
  <>
    {recipient && amount && (
      <div className='text-center mt-4'>
        <Typography>QR Code</Typography>
        <QRCode value={JSON.stringify({ recipient, amount })} />
      </div>
    )}
  </>
);
