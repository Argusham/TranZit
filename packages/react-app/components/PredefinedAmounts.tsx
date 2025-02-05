"use client";
// components/PredefinedAmounts.tsx
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // For smooth animations

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
  showZar
  
}: PredefinedAmountsProps) => {
  const [activeAmount, setActiveAmount] = useState<number | null>(null);
  const [flyAmount, setFlyAmount] = useState<number | null>(null);
  const [updatedPredefinedAmounts, setUpdatedPredefinedAmounts] = useState<number[]>(predefinedAmounts);

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
    const transformedAmounts = predefinedAmounts.map((amount) => Number.parseFloat((amount * conversionRate).toFixed(2)));
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
            ${activeAmount === amount ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-yellow-400" : "bg-transparent border-yellow-400 text-yellow-400 hover:shadow-yellow-400"}
            hover:scale-90 hover:border-yellow-500 hover:text-white`}
        >
          {amount} {showZar ? "ZAR" : "cUSD"}
          {activeAmount === amount && (
            <span className="absolute inset-0 rounded-lg animate-ping bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-30"></span>
          )}

          {/* Flying text effect */}
          {flyAmount === amount && (
            <motion.div
              className="absolute text-white p-10 text-2xl font-bold top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 0.5,
                x: -100, // Fly to the right (adjust this based on input position)
                y: -100, // Fly upwards (adjust based on input position)
              }}
              transition={{ duration: 1 }}
            >
              {amount} cUSD
            </motion.div>
          )}
        </Button>
      ))}
    </div>

  );
};
