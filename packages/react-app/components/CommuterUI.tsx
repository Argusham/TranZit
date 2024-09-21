// import { useState } from 'react';
// import PrimaryButton from '@/components/Button';
// import QrScanner from 'react-qr-scanner'; // Import the QR scanner package
// import { Button, Stack } from '@mui/material'; // Use Material-UI for styling

// interface CommuterUIProps {
//   onScanSuccess: (data: string) => void;
// }

// export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
//   const [scanning, setScanning] = useState(false);
//   const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // Add state to manage camera mode

//   // Handle scanning success
//   const handleScan = (data: any) => {
//     if (data) {
//       onScanSuccess(data.text); // Extract the scanned QR code data and pass it to the parent
//       setScanning(false);
//     }
//   };

//   // Handle scanning error
//   const handleError = (err: any) => {
//     console.error('QR Scan Error: ', err);
//   };

//   // Toggle camera between front and back
//   const toggleCamera = () => {
//     setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
//   };

//   // QR scanner settings
//   const previewStyle = {
//     height: 240,
//     width: '100%',
//   };

//   return (
//     <>
//       {!scanning ? (
//         <PrimaryButton title='Pay' onClick={() => setScanning(true)} widthFull />
//       ) : (
//         <>
//           <QrScanner
//             delay={300}
//             onError={handleError}
//             onScan={handleScan}
//             style={previewStyle}
//             facingMode={facingMode} // Set the camera based on facingMode state
//           />
//           <Stack direction="row" justifyContent="center" spacing={2} className="mt-2">
//             <Button variant="contained" color="primary" onClick={toggleCamera}>
//               Switch Camera
//             </Button>
//             <Button variant="contained" color="secondary" onClick={() => setScanning(false)}>
//               Cancel
//             </Button>
//           </Stack>
//         </>
//       )}
//     </>
//   );
// };



// import { useState } from 'react';
// import PrimaryButton from '@/components/Button';
// import QrScanner from 'react-qr-scanner'; // Import the QR scanner package
// import { Button, Stack } from '@mui/material'; // Use Material-UI for styling
// import { usePayments } from '@/hooks/usePayment'; // Use the new payments hook

// interface CommuterUIProps {
//   onScanSuccess: (data: string) => void;
// }

// export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
//   const [scanning, setScanning] = useState(false);
//   const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
//   const { payUser, loading } = usePayments(null); // Replace old hook with new payment hook

//   // Handle scanning success
//   const handleScan = (data: any) => {
//     if (data) {
//       onScanSuccess(data.text); // Extract the scanned QR code data and pass it to the parent
//       setScanning(false);
//     }
//   };

//   const handleError = (err: any) => console.error('QR Scan Error: ', err);

//   const toggleCamera = () => setFacingMode(prevMode => (prevMode === 'environment' ? 'user' : 'environment'));

//   const previewStyle = { height: 240, width: '100%' };

//   return (
//     <>
//       {!scanning ? (
//         <PrimaryButton title="Pay" onClick={() => setScanning(true)} widthFull />
//       ) : (
//         <>
//           <QrScanner
//             delay={300}
//             onError={handleError}
//             onScan={handleScan}
//             style={previewStyle}
//             facingMode={facingMode}
//           />
//           <Stack direction="row" justifyContent="center" spacing={2} className="mt-2">
//             <Button variant="contained" color="primary" onClick={toggleCamera}>Switch Camera</Button>
//             <Button variant="contained" color="secondary" onClick={() => setScanning(false)}>Cancel</Button>
//           </Stack>
//         </>
//       )}
//     </>
//   );
// };

import { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Button, Stack } from '@mui/material';
import { usePayments } from '@/hooks/usePayment';

interface CommuterUIProps {
  onScanSuccess: (data: string) => void;
}

export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { payUser, loading } = usePayments(null);

  const handleScan = (data: any) => {
    if (data) {
      onScanSuccess(data.text);
      setScanning(false);
    }
  };

  const handleError = (err: any) => console.error('QR Scan Error: ', err);

  const toggleCamera = () => setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));

  const previewStyle = { height: 240, width: '100%' };

  return (
    <>
      {!scanning ? (
        <button
          className="py-3 px-6 bg-neon-green text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl hover:scale-110 transition-transform transform active:scale-95 duration-300 ease-in-out"
          onClick={() => setScanning(true)}
        >
          Scan to Pay
        </button>
      ) : (
        <>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            facingMode={facingMode}
          />
          <Stack direction="row" justifyContent="center" spacing={2} className="mt-4">
            <Button
              variant="contained"
              style={{ backgroundColor: '#00ff80', color: '#000', fontWeight: 'bold' }}
              className="transition-transform transform hover:scale-105 active:scale-95 duration-300"
              onClick={toggleCamera}
            >
              Switch Camera
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: '#ff4d4d', color: '#fff', fontWeight: 'bold' }}
              className="transition-transform transform hover:scale-105 active:scale-95 duration-300"
              onClick={() => setScanning(false)}
            >
              Cancel
            </Button>
          </Stack>
        </>
      )}
    </>
  );
};

