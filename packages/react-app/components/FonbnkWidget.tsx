import { useWallets } from "@/context/WalletProvider";

const FonbnkWidget = () => {
  const { address } = useWallets();
  const network = "CELO";
  const secretKey = process.env.NEXT_PUBLIC_FONBNK_SECRET_KEY;
  // const payWidgetLink = `https://pay.fonbnk.com/?${secretKey}=${walletAddress}&network=${network}`;
  const payWidgetLink = `https://pay.fonbnk.com/?source=${secretKey}&network=${network}&asset=CUSD&amount=1.03&currency=usdc&provider=bank_transfer&country=ZA&address=${address}&freezeWallet=1`;


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
