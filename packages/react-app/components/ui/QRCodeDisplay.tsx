"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  recipient: string;
  amount: string;
}

export const QRCodeDisplay = ({ recipient, amount }: QRCodeDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {recipient && amount && (
        <div className="flex flex-col items-center bg-white rounded-3xl p-4 border border-[#E5E5EA] max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-[#1C1C1E] mb-3">Scan to Pay</h2>

          <div
            onClick={toggleModal}
            className="p-3 bg-[#F2F2F7] rounded-2xl cursor-pointer transition hover:scale-105"
          >
            <QRCode
              className="rounded-xl"
              size={160}
              value={JSON.stringify({ recipient, amount })}
            />
          </div>

          <p className="text-xs text-[#8E8E93] mt-2">Tap to enlarge</p>
        </div>
      )}

      {/* Popup Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 rounded-2xl max-w-[90%] w-full sm:w-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-center text-[#1C1C1E] mb-4">
              Payment QR Code
            </h3>
            <QRCode
              className="rounded-xl mx-auto"
              size={260}
              value={JSON.stringify({ recipient, amount })}
            />
            <p className="text-center text-sm text-[#8E8E93] mt-3">Tap outside to close</p>
          </div>
        </div>
      )}
    </>
  );
};
