// components/UserInfo.tsx
import { Stack, Typography, Divider, Chip } from '@mui/material';

interface WalletInfoProps {
  address: string | null;
  currentWalletAmount: string | null;
}

const WalletInfo = ({ address, currentWalletAmount }: WalletInfoProps) => {
  return (
    <>
      {/* Display the current user's address */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Current User Address</h2>
        <p className="text-gray-600">{address ? address : 'No address connected'}</p>
      </div>

      {/* Display the current wallet cUSD balance */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Current Wallet Balance</h2>
        <p className="text-gray-600">
          {currentWalletAmount ? `${currentWalletAmount} cUSD` : 'Fetching balance...'}
        </p>
      </div>
    </>
  );
};

export default WalletInfo;
