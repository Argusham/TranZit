/* eslint-disable @next/next/no-img-element */
"use client";

import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { lightTheme } from "thirdweb/react";
import { celo } from "thirdweb/chains";
import { client } from "../hooks/client";
import { useWallets } from "../context/WalletProvider";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "phone"],
      defaultSmsCountryCode: "ZA",
      mode: "popup",
    },
    hidePrivateKeyExport: true,
  }),
];

export default function Connect() {
  const { isConnected } = useWallets();

  return (
    <>
      {!isConnected && (
        <div className="flex justify-center">
          <ConnectButton
            onConnect={(wallet) => {
              console.log("connected to", wallet);
              close();
            }}
            client={client}
            wallets={wallets}
            theme={lightTheme({
              colors: {
                borderColor: "hsl(216, 100%, 60%)",
                accentText: "hsl(216, 100%, 60%)",
                tertiaryBg: "hsl(285, 14%, 95%)",
                modalBg: "hsl(300, 20%, 99%)",
                primaryButtonBg: "hsl(221, 88%, 57%)",
              },
            })}
            connectButton={{ label: "Get started" }}
            connectModal={{
              size: "compact",
              title: "Welcome to Tranzit",
              showThirdwebBranding: false,
            }}
            accountAbstraction={{
              chain: celo,
              sponsorGas: true,
            }}
          />
        </div>
      )}
    </>
  );
}
