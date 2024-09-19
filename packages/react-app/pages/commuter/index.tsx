/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter for navigation
import QrScanner from "react-qr-scanner"; // Import the QR scanner package
import { Button, Stack, CircularProgress, Switch } from "@mui/material"; // Use Material-UI for styling
import { useGasEstimation } from "@/hooks/useGasEstimation";
import { useWeb3State } from "@/hooks/useWeb3State";
import blockies from "ethereum-blockies"; // Import blockies to generate profile icons

export default function CommuterUI() {
  const router = useRouter(); // Initialize router
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  ); // Add state to manage camera mode
  const [recipient, setRecipient] = useState<string>(""); // For storing scanned recipient address
  const [amount, setAmount] = useState<string>(""); // For storing scanned amount
  const [showZar, setShowZar] = useState(false); // State for toggling between cUSD and ZAR
  const [conversionRate, setConversionRate] = useState<number | null>(null); // Store the conversion rate

  // Web3 state and gas estimation
  const {
    address,
    balance,
    transactionStatus,
    tx,
    errorMessage,
    signingLoading,
    sendTransaction,
  } = useWeb3State();
  const { gasEstimate, gasPrice } = useGasEstimation(recipient, amount); // Use recipient and amount to get gas estimate

  // Fetch conversion rate from API
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        const rate = data.rates.ZAR; // Get ZAR conversion rate
        setConversionRate(rate);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };

    fetchConversionRate();
  }, []); // Fetch once when the component mounts

  const zarBalance = conversionRate
    ? (Number(balance) * conversionRate).toFixed(2)
    : "Loading..."; // Convert balance to ZAR

  const goBack = () => {
    router.back(); // Navigate to the previous page
  };

  // Handle scanning success
  const handleScan = (data: any) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data.text); // Assuming the QR code contains JSON with recipient and amount
        setRecipient(parsedData.recipient);
        setAmount(parsedData.amount);
        setScanning(false); // Close scanner after a successful scan
      } catch (err) {
        console.error("Error parsing QR code:", err);
      }
    }
  };

  // Handle scanning error
  const handleError = (err: any) => {
    console.error("QR Scan Error: ", err);
  };

  // Toggle camera between front and back
  const toggleCamera = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  // QR scanner settings
  const previewStyle = {
    height: 240,
    width: "100%",
  };

  // Handle the pay button click after scanning the QR code
  const handlePay = () => {
    if (recipient && amount) {
      sendTransaction(recipient, amount); // Use the web3 hook to send the transaction
    }
  };

  // Format the address to show only first and last 5 characters
  const formatAddress = (address: string) => {
    return `${address.substring(0, 5)}...${address.substring(
      address.length - 5
    )}`;
  };

  // Generate the blockie for the user address
  const blockieDataUrl = address
    ? blockies.create({ seed: address }).toDataURL()
    : "";

  return (
    <div className="flex flex-col items-center bg-black text-white min-h-screen px-4 py-6">
      {/* Back Button */}
      <div className="w-full flex items-center mb-4">
        <button onClick={goBack} className="text-white flex items-center">
          <img
            src="/path-to-back-icon.png"
            alt="Back"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Profile Section */}
      <div className="w-full bg-green-600 p-4 rounded-2xl mb-6">
        <div className="flex items-center">
          {/* Display blockie - image on the left */}
          <img
            src={blockieDataUrl}
            alt="Commuter Avatar"
            className="w-10 h-10 rounded-full mr-4" // Adjusted size and spacing
          />

          {/* Text section - Hello Passenger and Address on the right */}
          <div className="flex flex-col justify-center">
            <p className="text-l">Hello Passenger👋</p>
            <h2 className="text-sm font-bold">
              {address ? formatAddress(address) : "Address not available"}
            </h2>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm">Wallet Balance:</p>
          {/* Toggle switch between cUSD and ZAR */}
          <div className="flex items-center">
            <h3 className="text-4xl font-bold">
              {showZar ? `ZAR ${zarBalance}` : `cU$D ${balance}`}
            </h3>
            <Switch
              checked={showZar}
              onChange={() => setShowZar(!showZar)}
              color="default"
              inputProps={{ "aria-label": "Toggle currency display" }}
            />
          </div>
          <p className="text-sm">Switch to {showZar ? "cU$D" : "ZAR"}</p>
        </div>

        {/* Pay Button or QR Scanner */}
        {!scanning ? (
          <>
            <button
              className="mt-4 bg-white text-green-600 w-full py-3 rounded-full font-semibold"
              onClick={() => setScanning(true)}
            >
              Scan to Pay
            </button>
            {/* Gas Estimate and Gas Price */}
            {gasEstimate && gasPrice && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-300">
                  Gas Estimate: {gasEstimate}
                </p>
                <p className="text-sm text-gray-300">Gas Price: {gasPrice}</p>
              </div>
            )}

            {/* Transaction Status */}
            {signingLoading && <CircularProgress color="inherit" />}
            {transactionStatus && <p className="mt-4">{transactionStatus}</p>}
            {errorMessage && (
              <p className="mt-4 text-red-500">{errorMessage}</p>
            )}
            {tx && (
              <p className="mt-4">
                Transaction Hash:{" "}
                {(tx.transactionHash as string).substring(0, 6)}...
                {(tx.transactionHash as string).substring(
                  tx.transactionHash.length - 6
                )}
              </p>
            )}
            {recipient && amount && (
              <button
                className="mt-4 bg-white text-green-600 w-full py-3 rounded-full font-semibold"
                onClick={handlePay}
              >
                Pay Now
              </button>
            )}
          </>
        ) : (
          <>
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={previewStyle}
              facingMode={facingMode} // Set the camera based on facingMode state
            />
            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              className="mt-2"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={toggleCamera}
              >
                Switch Camera
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setScanning(false)}
              >
                Cancel
              </Button>
            </Stack>
          </>
        )}
      </div>

      {/* Additional Info Cards */}
      <div className="w-full space-y-4">
        <div className="bg-gray-800 p-4 rounded-2xl flex justify-between items-center">
          <p className="font-bold">Automatic</p>
          <p className="font-bold text-green-500">$150.87</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl flex justify-between items-center">
          <p className="font-bold">1P Challenge</p>
          <p className="font-bold text-green-500">Set aside $667 this year</p>
        </div>
      </div>
    </div>
  );
}
