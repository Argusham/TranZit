// /* eslint-disable @next/next/no-img-element */
// import blockies from "ethereum-blockies";
// import { Switch } from "@mui/material";

// interface WalletInfoProps {
//   address: string | null;
//   currentWalletAmount: string | null;
//   showZar: boolean;
//   zarBalance: string | null;
//   setShowZar: (value: boolean) => void;
// }

// const WalletInfo = ({ address, currentWalletAmount, showZar, zarBalance, setShowZar }: WalletInfoProps) => {
//   const blockieDataUrl = address ? blockies.create({ seed: address }).toDataURL() : '';

//   return (
//     <div className="w-full bg-green-600 p-4 rounded-2xl mb-6">
//       <div className="flex items-center">
//         {/* Display blockie */}
//         <img src={blockieDataUrl} alt="Commuter Avatar" className="w-10 h-10 rounded-full mr-4" />
//         <div className="flex flex-col justify-center">
//           <p className="text-l">Hello Passenger👋</p>
//           <h2 className="text-sm font-bold">
//             {address ? `${address.substring(0, 5)}...${address.substring(address.length - 5)}` : 'Address not available'}
//           </h2>
//         </div>
//       </div>

//       <div className="mt-4">
//         <p className="text-sm">Wallet Balance:</p>
//         {/* Toggle between cUSD and ZAR */}
//         <div className="flex items-center">
//           <h3 className="text-4xl font-bold">
//             {showZar ? `ZAR ${zarBalance}` : `cUSD ${currentWalletAmount}`}
//           </h3>
//           <Switch checked={showZar} onChange={() => setShowZar(!showZar)} color="default" />
//         </div>
//         <p className="text-sm">Switch to {showZar ? 'cUSD' : 'ZAR'}</p>
//       </div>
//     </div>
//   );
// };

// export default WalletInfo;


/* eslint-disable @next/next/no-img-element */
import blockies from "ethereum-blockies";
import { Switch } from "@mui/material";
import { useUserRole } from "@/context/UserRoleContext";

interface WalletInfoProps {
  address: string | null;
  currentWalletAmount: string | null;
  showZar: boolean;
  zarBalance: string | null;
  setShowZar: (value: boolean) => void;
}

const WalletInfo = ({ address, currentWalletAmount, showZar, zarBalance, setShowZar }: WalletInfoProps) => {
  const { role } = useUserRole(); // Access user role from context
  const blockieDataUrl = address ? blockies.create({ seed: address }).toDataURL() : '';

  return (
    <div className="w-full bg-yellow-400 text-black p-4 rounded-2xl mb-6">
      <div className="flex items-center">
        {/* Display blockie */}
        <img src={blockieDataUrl} alt="User Avatar" className="w-10 h-10 rounded-full mr-4" />
        <div className="flex flex-col justify-center">
          <p className="text-l">
            {role === 'commuter' ? 'Hello Passenger👋' : 'Hello Driver👋'}
          </p>
          <h2 className="text-sm font-bold">
            {address ? `${address.substring(0, 5)}...${address.substring(address.length - 5)}` : 'Address not available'}
          </h2>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm">Wallet Balance:</p>
        {/* Toggle between cUSD and ZAR */}
        <div className="flex items-center">
          <h3 className="text-4xl font-bold">
            {showZar ? `ZAR ${zarBalance}` : `cUSD ${currentWalletAmount}`}
          </h3>
          <Switch checked={showZar} onChange={() => setShowZar(!showZar)} color="default" />
        </div>
        <p className="text-sm">Switch to {showZar ? 'cUSD' : 'ZAR'}</p>
      </div>
    </div>
  );
};

export default WalletInfo;
