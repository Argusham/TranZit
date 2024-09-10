// components/GasInfo.tsx
import { Stack, Typography } from '@mui/material';

interface GasInfoProps {
  gasEstimate: string | null;
  gasPrice: string | null;
}

export const GasInfo = ({ gasEstimate, gasPrice }: GasInfoProps) => (
  <>
    {gasEstimate && (
      <div className='text-center mt-4'>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography>Gas Estimate:</Typography>
          <Typography>{gasEstimate}</Typography>
        </Stack>
      </div>
    )}

    {gasPrice && (
      <div className='text-center mt-4'>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography>Gas Price:</Typography>
          <Typography>{gasPrice}</Typography>
        </Stack>
      </div>
    )}
  </>
);
