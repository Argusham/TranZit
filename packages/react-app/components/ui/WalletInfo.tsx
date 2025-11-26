/* eslint-disable @next/next/no-img-element */
import blockies from "ethereum-blockies";
import { useUserRole } from "@/context/UserRoleContext";
import { useWallets } from "@/context/WalletProvider";
import { useRouter } from "next/router";

interface WalletInfoProps {
  showZar: boolean;
  zarBalance: string | null;
  setShowZar: (value: boolean) => void;
}

const WalletInfo = ({ showZar, zarBalance, setShowZar }: WalletInfoProps) => {
  const { role } = useUserRole();
  const { address, balance, disconnectWallet } = useWallets();
  const router = useRouter();
  const blockieDataUrl = address ? blockies.create({ seed: address }).toDataURL() : "";
  const formattedBalance = Number(balance || 0).toFixed(2);

  const handleDisconnect = () => {
    disconnectWallet();
    router.push("/");
  };

  return (
    <div className="w-full max-w-md mx-auto p-1 rounded-3xl bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="bg-white rounded-3xl p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-50 rounded-2xl p-3">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={blockieDataUrl}
              alt="User Avatar"
              className="w-12 h-12 rounded-2xl flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {role === "commuter" ? "Passenger" : "Driver"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {address
                  ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
                  : "Not Connected"}
              </p>
            </div>
          </div>

          {address && (
            <button
              onClick={handleDisconnect}
              className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-xl hover:bg-red-200 transition"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Balance */}
        <div>
          <p className="text-sm text-blue-700">Balance</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">
            {showZar ? `R ${zarBalance}` : `$ ${formattedBalance || "0.00"}`}
          </h3>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center space-x-3">
          <span className={`text-sm font-medium ${!showZar ? "text-gray-900" : "text-gray-400"}`}>
            cU$D
          </span>
          <div
            onClick={() => setShowZar(!showZar)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out bg-blue-200 ${
              showZar ? "justify-end" : "justify-start"
            }`}
          >
            <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
          </div>
          <span className={`text-sm font-medium ${showZar ? "text-gray-900" : "text-gray-400"}`}>
            ZAR
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
