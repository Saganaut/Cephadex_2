import React, { useEffect, useState } from "react";

interface TipsRotatorProps {
  tips: string[];
  interval: number;
}

const TipsRotator: React.FC<TipsRotatorProps> = ({ tips, interval }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [opacity, setOpacity] = useState("opacity-0");

  useEffect(() => {
    const nextTip = (): void => {
      setOpacity("opacity-0");
      setTimeout(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setOpacity("opacity-100");
      }, 1000);
    };

    const tipInterval = setInterval(nextTip, interval + 1000);

    return () => {
      clearInterval(tipInterval);
    };
  }, [tips.length, interval]);

  return (
    <div className={`transition-opacity duration-500 ${opacity}`}>
      {tips.length > 0 ? (
        <p>{tips[currentTipIndex]}</p>
      ) : (
        <p>No tips available</p>
      )}
    </div>
  );
};

export { TipsRotator };
