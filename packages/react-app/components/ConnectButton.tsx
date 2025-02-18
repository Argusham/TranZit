import { Disclosure } from "@headlessui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, [connect]);

  return (
    <>
      
        <div className="relative flex h-10">
          <div className="pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {!hideConnectBtn && (
              <ConnectButton
                showBalance={{
                  smallScreen: true,
                  largeScreen: false,
                }}
              />
            )}
          </div>
        </div>
     
    </>
  );
}
