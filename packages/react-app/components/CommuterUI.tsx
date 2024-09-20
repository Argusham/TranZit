import { useState } from 'react';
import PrimaryButton from '@/components/Button';
import QrScanner from 'react-qr-scanner'; // Import the QR scanner package
import { Button, Stack } from '@mui/material'; // Use Material-UI for styling
import { usePayments } from '@/hooks/usePayment'; // Use the new payments hook

interface CommuterUIProps {
  onScanSuccess: (data: string) => void;
}

export const CommuterUI = ({ onScanSuccess }: CommuterUIProps) => {
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { payUser, loading } = usePayments(null); // Replace old hook with new payment hook

  // Handle scanning success
  const handleScan = (data: any) => {
    if (data) {
      onScanSuccess(data.text); // Extract the scanned QR code data and pass it to the parent
      setScanning(false);
    }
  };

  const handleError = (err: any) => console.error('QR Scan Error: ', err);

  const toggleCamera = () => setFacingMode(prevMode => (prevMode === 'environment' ? 'user' : 'environment'));

  const previewStyle = { height: 240, width: '100%' };

  return (
    <>
      {!scanning ? (
        <PrimaryButton title="Pay" onClick={() => setScanning(true)} widthFull />
      ) : (
        <>
          <QrScanner
            delay={5000}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            facingMode={facingMode}
          />
          <Stack direction="row" justifyContent="center" spacing={2} className="mt-2">
            <Button variant="contained" color="primary" onClick={toggleCamera}>Switch Camera</Button>
            <Button variant="contained" color="secondary" onClick={() => setScanning(false)}>Cancel</Button>
          </Stack>
        </>
      )}
    </>
  );
};
