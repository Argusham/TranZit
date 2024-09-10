// components/UserInfo.tsx
import { Stack, Typography, Divider, Chip } from '@mui/material';

interface UserInfoProps {
  address: string;
  balance: string;
}

export const UserInfo = ({ address, balance }: UserInfoProps) => (
  <>
    <Typography>Connected Address:</Typography>
    <div className='font-bold text-sm break-all'>{address}</div>
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Typography>Balance:</Typography>
      <Typography>{balance} cUSD</Typography>
    </Stack>
    <div className='font-bold text-lg m-2'></div>
    <Divider>
      <Chip label='Enter Recipient Details Below' size='small' />
    </Divider>
  </>
);
