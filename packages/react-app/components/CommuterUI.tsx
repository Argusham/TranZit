import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/components/Button';
import { Button, Stack } from '@mui/material';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface CommuterUIProps {
  onScanSuccess: (data: string) => void;
}

type ScannerState = 'stopped' | 'starting' | 'scanning' | 'stopping';

export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
  const [scannerState, setScannerState] = useState<ScannerState>('stopped');

  // Reference to the reader element
  const readerRef = useRef<HTMLDivElement | null>(null);

  // Start scanning
  const startScanning = async () => {
    if (scannerState !== 'stopped') {
      console.warn('Scanner is not in a state to start scanning');
      return;
    }

    if (readerRef.current) {
      const qrCodeScanner = new Html5Qrcode(readerRef.current.id);
      qrCodeScannerRef.current = qrCodeScanner;
      setScannerState('starting');

      const config = {
        fps: 10,
        qrbox: function (viewfinderWidth: number, viewfinderHeight: number) {
          const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdgeSize * 0.75); // Adjust the percentage as needed
          return {
            width: qrboxSize,
            height: qrboxSize,
          };
        },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      try {
        await qrCodeScanner.start(
          { facingMode },
          config,
          (decodedText) => {
            onScanSuccess(decodedText);
            setScanning(false); // This will trigger stopScanning via useEffect
          },
          (errorMessage) => {
            console.warn('QR Scan Error:', errorMessage);
          }
        );
        setScannerState('scanning');
      } catch (err) {
        console.error('Failed to start scanning:', err);
        setScannerState('stopped');
      }
    } else {
      console.error('Reader element not found');
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

  // Handle Pay button click
  const handlePayClick = () => {
    setScanning(true);
  };

  // Handle Cancel button click
  const handleCancelClick = () => {
    setScanning(false);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (scannerState !== 'scanning') {
      console.warn('Cannot switch camera, scanner is not active');
      return;
    }

    stopScanning().then(() => {
      setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
      setTimeout(() => {
        if (scanning) {
          startScanning();
        }
      }, 500);
    });
  };

  // Effect to start/stop scanning when scanning state changes
  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }

    // Cleanup function
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning, facingMode]);

  return (
    <>
      {!scanning ? (
        <PrimaryButton title="Scan to pay"  onClick={handlePayClick} widthFull />
      ) : (
        <>
          <div
            id="reader"
            ref={readerRef}
            className="relative w-full max-w-xs mx-auto rounded-3xl overflow-hidden shadow-lg border-4 border-yellow-400"
            style={{
              aspectRatio: '1 / 1', // Ensures a square aspect ratio
            }}
          >
            {/* Empty div for the QR reader */}
            <div className="absolute inset-0"></div>
          </div>
          <Stack direction="row" justifyContent="center" spacing={2} className="mt-4">
            <Button variant="contained" color="primary" onClick={toggleCamera}>
              Switch Camera
            </Button>
            <Button variant="contained" color="error" onClick={handleCancelClick}>
              Cancel
            </Button>
          </Stack>
        </>
      )}
    </>
  );
};
