/* eslint-disable react-hooks/exhaustive-deps */
"use client";
// components/PredefinedAmounts.tsx
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

interface PredefinedAmountsProps {
  predefinedAmounts: number[];
  handleAmountClick: (amount: number) => void;
  conversionRate: number;
  showZar: boolean;
}

export const PredefinedAmounts = ({
  predefinedAmounts,
  handleAmountClick,
  conversionRate,
  showZar,
}: PredefinedAmountsProps) => {
  const [activeAmount, setActiveAmount] = useState<number | null>(null);
  const [flyAmount, setFlyAmount] = useState<number | null>(null);
  const [updatedPredefinedAmounts, setUpdatedPredefinedAmounts] =
    useState<number[]>(predefinedAmounts);

  const handleClick = (amount: number) => {
    setActiveAmount(amount);
    setFlyAmount(amount); // Trigger the flying text animation
    handleAmountClick(amount);

    // After the animation completes, reset the flyAmount
    setTimeout(() => setFlyAmount(null), 1000);
  };

  useEffect(() => {
    if (!showZar) {
      conversionRate = 1;
    }
    const transformedAmounts = predefinedAmounts.map((amount) =>
      Number.parseFloat((amount * conversionRate).toFixed(2))
    );
    setUpdatedPredefinedAmounts(transformedAmounts);
    console.log(predefinedAmounts);
  }, [showZar]);

  return (
    <div className="flex mt-[20px] flex-row justify-center space-x-4 mb-8 relative">
      {updatedPredefinedAmounts.map((amount) => (
        <Button
          key={amount}
          onClick={() => handleClick(amount)}
          className={`relative px-8 py-3 border-2 text-lg font-semibold rounded-lg transform transition-transform duration-300 ease-out
            ${
              activeAmount === amount
                ? ""
                : ""
            }
            hover:scale-90 hover:border-yellow-500`}
        >
          {amount} {showZar ? "ZAR" : "cUSD"}
          {activeAmount === amount && (
            <span className="absolute inset-0 rounded-lg animate-ping bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-30"></span>
          )}
          {/* Flying text effect */}
          {flyAmount === amount && (
            <div className="absolute p-10 text-2xl font-bold top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {amount} cUSD
            </div>
          )}
        </Button>
      ))}
    </div>
  );
};
