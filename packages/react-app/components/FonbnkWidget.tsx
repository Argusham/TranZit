import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

const FonbnkWidget = () => {
  const { wallets } = useWallets();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  useEffect(() => {
    if (wallets.length > 0) {
      setWalletAddress(wallets[0].address || null);
    }
  }, [wallets]);

  const network = "CELO";
  const secretKey = process.env.FONBNK_SECRET_KEY;

  if (!walletAddress) {
    return <p className="text-center text-red-500">❌ Please connect your wallet to use this feature.</p>;
  }

  const payWidgetLink = `https://pay.fonbnk.com/?source=${secretKey}&network=${network}&asset=CUSD&amount=1.03&currency=usdc&provider=bank_transfer&country=ZA&address=${walletAddress}&freezeWallet=1`;

  return (
    <div className="w-full max-w-md mx-auto relative overflow-hidden" style={{ paddingTop: "190%" }}>
      <iframe
        src={payWidgetLink}
        className="absolute top-0 left-0 w-full h-full border-0"
      />
    </div>
  );
};

export default FonbnkWidget;
