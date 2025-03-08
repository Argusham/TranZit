// import { Disclosure } from "@headlessui/react";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useEffect, useState } from "react";
// import { useConnect } from "wagmi";
// import { injected } from "wagmi/connectors";

// export default function Header() {
//   const [hideConnectBtn, setHideConnectBtn] = useState(false);
//   const { connect } = useConnect();

//   useEffect(() => {
//     if (window.ethereum && window.ethereum.isMiniPay) {
//       setHideConnectBtn(true);
//       connect({ connector: injected({ target: "metaMask" }) });
//     }
//   }, [connect]);

//   return (
//     <>

//         <div className="relative flex h-10">
//           <div className="pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
//             {!hideConnectBtn && (
//               <ConnectButton
//                 showBalance={{
//                   smallScreen: true,
//                   largeScreen: false,
//                 }}
//               />
//             )}
//           </div>
//         </div>

//     </>
//   );
// }

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
          chain: celo, // replace with the chain you want
          sponsorGas: true,
        }}
      />
    </div>
  );
}
