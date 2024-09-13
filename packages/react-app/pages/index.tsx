// import { useState } from 'react';
// import { useWeb3State } from '@/hooks/useWeb3State';
// import { useGasEstimation } from '@/hooks/useGasEstimation';
// import { Card, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { UserInfo } from '@/components/UserInfo';
// import { DriverUI } from '@/components/DriverUI';
// import { CommuterUI } from '@/components/CommuterUI';

// export default function Home() {
//   const { address, balance, transactionStatus, tx, errorMessage, signingLoading, sendTransaction } = useWeb3State();
//   const [amount, setAmount] = useState<string>('');
//   const predefinedAmounts = [1, 2, 0.5];
//   const [mode, setMode] = useState<'driver' | 'commuter'>('commuter'); // Driver/Commuter toggle

//   // Get gas estimates
//   const { gasEstimate, gasPrice } = useGasEstimation(address ?? "", amount); // Driver's address is used for gas estimation

//   // Handle toggle change
//   const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'driver' | 'commuter') => {
//     if (newMode) {
//       setMode(newMode);
//     }
//   };

//   // Handle successful scan by commuter
//   const handleScanSuccess = (data: string) => {
//     try {
//       const parsedData = JSON.parse(data);
//       const { recipient, amount } = parsedData;
//       sendTransaction(recipient, amount); // Use the scanned recipient and amount
//     } catch (error) {
//       console.error('Error parsing QR code:', error);
//     }
//   };

//   return (
//     <div className='flex flex-col items-center p-2 rounded-xl bg-grey-100'>
//       {/* Toggle between Driver and Commuter UI */}
//       <ToggleButtonGroup
//         color='primary'
//         value={mode}
//         exclusive
//         onChange={handleModeChange}
//         aria-label='Driver or Commuter mode'
//         className='mb-4'
//       >
//         <ToggleButton value='commuter'>Commuter</ToggleButton>
//         <ToggleButton value='driver'>Driver</ToggleButton>
//       </ToggleButtonGroup>

//       <Card className='w-full max-w-md bg-white rounded-3xl p-6 shadow-lg'>
//         <div className='text-center mb-6'>
//           <h1 className='text-2xl font-bold mb-2'>Taxi Zoom</h1>

//           {address && <UserInfo address={address} balance={balance} />}
//         </div>

//         {address && (
//           <>
//             {/* Conditionally Render UI based on mode */}
//             {mode === 'commuter' && (
//               <>
//                 {/* Commuter UI */}
//                 <CommuterUI onScanSuccess={handleScanSuccess} />
//               </>
//             )}

//             {mode === 'driver' && (
//               <>
//                 {/* Driver UI */}
//                 <DriverUI
//                   address={address}
//                   amount={amount}
//                   setAmount={setAmount}
//                   predefinedAmounts={predefinedAmounts}
//                   transactionStatus={transactionStatus}
//                   gasEstimate={gasEstimate}
//                   gasPrice={gasPrice}
//                 />
//               </>
//             )}
//           </>
//         )}

//         {/* Transaction Hash */}
//         {tx && (
//           <p className='font-bold mt-4'>
//             Tx Completed: {(tx.transactionHash as string).substring(0, 6)}...
//             {(tx.transactionHash as string).substring(tx.transactionHash.length - 6)}
//           </p>
//         )}
//       </Card>
//     </div>
//   );
// }


// src/pages/index.tsx
import LandingPage from "./landingpage";

export default function Home() {
  return  (
         <LandingPage />
    );
  
}
