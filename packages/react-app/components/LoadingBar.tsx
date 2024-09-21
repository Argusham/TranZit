import { useEffect, useState } from 'react';

interface LoadingBarProps {
  duration?: number; // In milliseconds
}

export const LoadingBar = ({ duration = 3000 }: LoadingBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, duration / 100); // Increase progress over time

    return () => clearInterval(interval); // Clear interval on unmount
  }, [duration]);

  return (
    <div className="w-full bg-gray-300 rounded-lg overflow-hidden h-4">
      <div
        className="bg-neon-green h-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
