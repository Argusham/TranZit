/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // Show the prompt UI
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false); // Hide the custom prompt after user's choice
      });
    }
  };

  const handleCancelClick = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-center mb-2">Add to Home Screen</h3>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/icon.png" alt="App Icon" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">Tranzit</p>
                {/* <p className="text-sm text-gray-600">kampass</p> */}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCancelClick}
                className="text-blue-500 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInstallClick}
                className="text-blue-500 font-bold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;