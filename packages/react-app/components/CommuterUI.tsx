// // components/CommuterUI.tsx
// import { useState } from 'react';
// import PrimaryButton from '@/components/Button';
// import QrReader from 'react-qr-reader'; // You will need to install this package

// interface CommuterUIProps {
//   onScanSuccess: (data: string) => void;
// }

// export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
//   const [scanning, setScanning] = useState(false);

//   const handleScan = (data: any) => {
//     if (data) {
//       onScanSuccess(data); // Pass the scanned data to the parent component
//       setScanning(false);
//     }
//   };

//   const handleError = (err: any) => {
//     console.error(err);
//   };

//   return (
//     <>
//       {!scanning ? (
//         <PrimaryButton title='Pay' onClick={() => setScanning(true)} widthFull />
//       ) : (
//         <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
//       )}
//     </>
//   );
// };


import { useState } from 'react';
import PrimaryButton from '@/components/Button';
import QrScanner from 'react-qr-scanner'; // Import the QR scanner package
import { Button, Stack } from '@mui/material'; // Use Material-UI for styling

interface CommuterUIProps {
  onScanSuccess: (data: string) => void;
}

export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // Add state to manage camera mode

  // Handle scanning success
  const handleScan = (data: any) => {
    if (data) {
      onScanSuccess(data.text); // Extract the scanned QR code data and pass it to the parent
      setScanning(false);
    }
  };

  // Handle scanning error
  const handleError = (err: any) => {
    console.error('QR Scan Error: ', err);
  };

  // Toggle camera between front and back
  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
  };

  // QR scanner settings
  const previewStyle = {
    height: 240,
    width: '100%',
  };

  return (
    <>
      {!scanning ? (
        <PrimaryButton title='Pay' onClick={() => setScanning(true)} widthFull />
      ) : (
        <>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            facingMode={facingMode} // Set the camera based on facingMode state
          />
          <Stack direction="row" justifyContent="center" spacing={2} className="mt-2">
            <Button variant="contained" color="primary" onClick={toggleCamera}>
              Switch Camera
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setScanning(false)}>
              Cancel
            </Button>
          </Stack>
        </>
      )}
    </>
  );
};
