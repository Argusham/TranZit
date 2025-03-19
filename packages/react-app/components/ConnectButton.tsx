/* eslint-disable @next/next/no-img-element */
"use client";

import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { celo } from "thirdweb/chains";
import { client } from "../hooks/client";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "phone"],
      defaultSmsCountryCode: "ZA",
    },
    hidePrivateKeyExport: true,
  }),
];

export default function Connect() {
  return (
    <div className="flex justify-center mb-20">
      <ConnectButton
        client={client}
        wallets={wallets}
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
  );
}