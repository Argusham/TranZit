/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { IoShareOutline,} from "react-icons/io5";
import { MdOutlineAddBox } from "react-icons/md";

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const isInStandaloneMode = () => {
  return (
    "standalone" in window.navigator && (window.navigator as any).standalone
  );
};

const IOSPrompt = () => {
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    if (isIos() && !isInStandaloneMode()) {
      setIsIosDevice(true);
    }
  }, []);

  return (
    <>
      {isIosDevice && (
        <div className="fixed inset-0 flex items-end justify-center z-50">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-t-2xl w-full max-w-md mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add to Home Screen
              </h3>
              <button
                className="text-blue-600 text-sm font-medium"
                onClick={() => setIsIosDevice(false)}
              >
                Close
              </button>
            </div>

            <p className="text-sm text-gray-700 mb-4">
            This dapp has app functionality. Add it to your home screen by tapping{" "}
              <strong>Share</strong> and then <strong>Add to Home Screen</strong>.
            </p>

            {/* Step 1 */}
            <div className="flex items-center space-x-3 mb-3">
              <IoShareOutline className="text-xl text-gray-800" />
              <p className="text-sm text-gray-800">
                1) Tap the <strong>Share</strong> button.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex items-center space-x-3">
              <MdOutlineAddBox className="text-xl text-gray-800" />
              <p className="text-sm text-gray-800">
                2) Select <strong>Add to Home Screen</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IOSPrompt;