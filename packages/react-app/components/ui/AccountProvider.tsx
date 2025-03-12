import {
  AccountProvider,
  AccountAddress,
  Blobbie,
} from "thirdweb/react";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { celo } from "thirdweb/chains";

const CUSD_CONTRACT_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";

// Updated ABI for ERC-20 transfer function


interface FormProps {
  client: any; // Replace 'any' with the proper type if available
}

export default function Account({ client }: FormProps) {
  const account = useActiveAccount();
  const walletAddress = account?.address as string; // Get the wallet address

  const { data, isLoading } = useWalletBalance({
    chain: celo,
    address: walletAddress!,
    client,
    tokenAddress: CUSD_CONTRACT_ADDRESS,
  });

  if (isLoading) return <p>Loading balance...</p>;

  return (
    <AccountProvider address={walletAddress} client={client}>
      <Blobbie address={walletAddress} className="w-10 h-10" />
      <div className="text-center my-6">
        <h2 className="text-2xl font-bold">Your cUSD Balance</h2>
        <p className="mt-2">
          {data?.displayValue} {data?.symbol}
        </p>
      </div>
      <AccountAddress />
    </AccountProvider>
  );
}
