import QRCode from "react-qr-code";
interface QRCodeDisplayProps {
  recipient: string;
  amount: string;
}

export const QRCodeDisplay = ({ recipient, amount }: QRCodeDisplayProps) => {
  return (
    <>
      {recipient && amount && (
        <div className="flex flex-col items-center mt-6 bg-white p-5 rounded-2xl max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Scan to Pay
          </h2>

          <div className="p-3 bg-blue-500 rounded-lg">
            <QRCode
              className="rounded-lg"
              size={180}
              value={JSON.stringify({ recipient, amount })}
            />
          </div>
        </div>
      )}
    </>
  );
};
