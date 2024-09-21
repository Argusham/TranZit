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
      <div className='text-center mt-4 w-[fit-content] bg-red ml-[auto] mr-[auto]'>
        <Typography>QR Code</Typography>
        <QRCode className='' value={JSON.stringify({ recipient, amount })} />
      </div>
    )}
  </>
);
