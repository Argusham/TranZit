// import { useState } from "react";
// import { useWallets } from "@/context/WalletProvider";

// const FonbnkWidget = () => {
//   const [iframeVisible, setIframeVisible] = useState(false);
//   const { walletAddress } = useWallets(); // Get wallet from context

//   const network = "CELO"; // Ensure it's using the Celo network
//   const payWidgetLink = `https://pay.fonbnk.com?address=${walletAddress}&network=${network}`;

//   const displayIframe = () => {
//     setIframeVisible(true);
//   };

//   return (
//     <div className="">
//       {!iframeVisible ? (
//         <button
//           onClick={displayIframe}
//           className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-200 w-full max-w-xs"
//         >
//           Pay with Fonbnk
//         </button>
//       ) : (
//         <div className="w-full flex justify-center">
//           <iframe
//             src={payWidgetLink}
//             width="100%"
//             height="350"
//             className="border-0 max-w-sm sm:max-w-md md:max-w-lg"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default FonbnkWidget;


import { useWallets } from "@/context/WalletProvider";

const FonbnkWidget = () => {
  const { walletAddress } = useWallets();
  const network = "CELO";
  const payWidgetLink = `https://pay.fonbnk.com?address=${walletAddress}&network=${network}`;

  return (
    <div className="w-full max-w-md mx-auto relative overflow-hidden" style={{ paddingTop: "110%" }}>
      <iframe
        src={payWidgetLink}
        className="absolute top-0 left-0 w-full h-full border-0"
      />
    </div>
  );
};

export default FonbnkWidget;
