// import { useState, useEffect, useRef } from 'react';
// import PrimaryButton from '@/components/Button';
// import { Button, Stack } from '@mui/material';
// import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

// interface CommuterUIProps {
//   onScanSuccess: (data: string) => void;
// }

// type ScannerState = 'stopped' | 'starting' | 'scanning' | 'stopping';

// export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
//   const [scanning, setScanning] = useState(false);
//   const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
//   const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
//   const [scannerState, setScannerState] = useState<ScannerState>('stopped');

//   // Reference to the reader element
//   const readerRef = useRef<HTMLDivElement | null>(null);

//   // Start scanning
//   const startScanning = async () => {
//     if (scannerState !== 'stopped') {
//       console.warn('Scanner is not in a state to start scanning');
//       return;
//     }

//     if (readerRef.current) {
//       const qrCodeScanner = new Html5Qrcode(readerRef.current.id);
//       qrCodeScannerRef.current = qrCodeScanner;
//       setScannerState('starting');

//       const config = {
//         fps: 10,
//         qrbox: { width: 250, height: 250 },
//         formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
//       };

//       try {
//         await qrCodeScanner.start(
//           { facingMode },
//           config,
//           (decodedText) => {
//             onScanSuccess(decodedText);
//             setScanning(false); // This will trigger stopScanning via useEffect
//           },
//           (errorMessage) => {
//             console.warn('QR Scan Error:', errorMessage);
//           }
//         );
//         setScannerState('scanning');
//       } catch (err) {
//         console.error('Failed to start scanning:', err);
//         setScannerState('stopped');
//       }
//     } else {
//       console.error('Reader element not found');
//     }
//   };

//   // Stop scanning
//   const stopScanning = async () => {
//     if (scannerState !== 'scanning') {
//       console.warn('Scanner is not in a state to stop scanning');
//       return;
//     }

//     const qrCodeScanner = qrCodeScannerRef.current;
//     if (qrCodeScanner) {
//       setScannerState('stopping');
//       try {
//         await qrCodeScanner.stop();
//         await qrCodeScanner.clear();
//         qrCodeScannerRef.current = null;
//         setScannerState('stopped');
//       } catch (err) {
//         console.error('Failed to stop scanning:', err);
//         qrCodeScannerRef.current = null;
//         setScannerState('stopped');
//       }
//     }
//   };

//   // Handle Pay button click
//   const handlePayClick = () => {
//     setScanning(true);
//   };

//   // Handle Cancel button click
//   const handleCancelClick = () => {
//     setScanning(false);
//   };

//   // Toggle camera
//   const toggleCamera = () => {
//     if (scannerState !== 'scanning') {
//       console.warn('Cannot switch camera, scanner is not active');
//       return;
//     }

//     stopScanning().then(() => {
//       setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
//       setTimeout(() => {
//         if (scanning) {
//           startScanning();
//         }
//       }, 500);
//     });
//   };

//   // Effect to start/stop scanning when scanning state changes
//   useEffect(() => {
//     if (scanning) {
//       startScanning();
//     } else {
//       stopScanning();
//     }

//     // Cleanup function
//     return () => {
//       stopScanning();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [scanning, facingMode]);

//   return (
//     <>
//       {!scanning ? (
//         <PrimaryButton title="Pay" onClick={handlePayClick} widthFull />
//       ) : (
//         <>
//           <div id="reader" ref={readerRef} style={{ width: '100%', height: '300px' }}></div>
//           <Stack direction="row" justifyContent="center" spacing={2} className="mt-2">
//             <Button variant="contained" color="primary" onClick={toggleCamera}>
//               Switch Camera
//             </Button>
//             <Button variant="contained" color="secondary" onClick={handleCancelClick}>
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

type ScannerState = 'stopped' | 'starting' | 'scanning' | 'stopping';

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

  // Stop scanning
  const stopScanning = async () => {
    if (scannerState !== 'scanning') {
      console.warn('Scanner is not in a state to stop scanning');
      return;
    }

    const qrCodeScanner = qrCodeScannerRef.current;
    if (qrCodeScanner) {
      setScannerState('stopping');
      try {
        await qrCodeScanner.stop();
        await qrCodeScanner.clear();
        qrCodeScannerRef.current = null;
        setScannerState('stopped');
      } catch (err) {
        console.error('Failed to stop scanning:', err);
        qrCodeScannerRef.current = null;
        setScannerState('stopped');
      }
    }
  };


  const toggleCamera = () => setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));


    // Cleanup function
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning, facingMode]);

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

