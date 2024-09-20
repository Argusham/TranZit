// // components/QRCodeDisplay.tsx
// import QRCode from 'react-qr-code';
// import { Typography } from '@mui/material';

// interface QRCodeDisplayProps {
//   recipient: string;
//   amount: string;
// }

// export const QRCodeDisplay = ({ recipient, amount }: QRCodeDisplayProps) => (
//   <>
//     {recipient && amount && (
//       <div className='text-center mt-4'>
//         <Typography>QR Code</Typography>
//         <QRCode value={JSON.stringify({ recipient, amount })} />
//       </div>
//     )}
//   </>
// );


// components/QRCodeDisplay.tsx
import QRCode from 'react-qr-code';
import { Typography } from '@mui/material';

interface QRCodeDisplayProps {
  recipient: string;
  amount: string;
}

export const QRCodeDisplay = ({ recipient, amount }: QRCodeDisplayProps) => {
  const isDataValid = recipient && amount;

  return (
    <div className='text-center mt-4'>
      {isDataValid ? (
        <>
          <Typography variant="h6">Payment QR Code</Typography>
          <div className='p-4 bg-white inline-block rounded'>
            <QRCode value={JSON.stringify({ recipient, amount })} />
          </div>
        </>
      ) : (
        <Typography variant="body1" color="error">
          Recipient or amount missing. Unable to generate QR code.
        </Typography>
      )}
    </div>
  );
};
