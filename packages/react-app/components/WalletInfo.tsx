/* eslint-disable @next/next/no-img-element */
import blockies from "ethereum-blockies";
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
    <div className="w-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-opacity-100 p-4 rounded-3xl mb-6 shadow-lg text-white">
      <div className="flex items-center">
        {/* Display blockie */}
        <img
          src={blockieDataUrl}
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-4 border-2 border-yellow-400 shadow-md"
        />
        <div className="flex flex-col justify-center">
          <p className="text-lg text-yellow-400">
            {role === 'commuter' ? 'Hello Passenger 😎' : 'Hello Driver 🚖'}
          </p>
          <h2 className="text-sm font-semibold">
            {address ? `${address.substring(0, 5)}...${address.substring(address.length - 5)}` : 'Address not available'}
          </h2>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm">Wallet Balance:</p>
        {/* Toggle between cUSD and ZAR */}
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-3xl font-bold text-yellow-400">
            {showZar ? `ZAR ${zarBalance}` : `cU$D ${currentWalletAmount}`}
          </h3>

          {/* Custom Tailwind Toggle */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${!showZar ? 'text-yellow-400' : 'text-white'}`}>cU$D</span>
            <div
              onClick={() => setShowZar(!showZar)}
              className={`w-10 h-5 flex items-center bg-gray-700 rounded-full p-1 cursor-pointer ${
                showZar ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            </div>
            <span className={`text-sm ${showZar ? 'text-yellow-400' : 'text-white'}`}>ZAR</span>
          </div>
        </div>
        <p className="text-sm mt-2">Switch to {showZar ? 'cUSD' : 'ZAR'}</p>
      </div>
    </div>
  );
};

export default WalletInfo;
