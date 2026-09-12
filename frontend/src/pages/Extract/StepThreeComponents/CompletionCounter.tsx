// import { SunsetWaves } from "@source/common/Animations/loaders/SunsetWaves";
import { useDeckNotificationContext } from "@source/lib/contexts/DeckNotificationContext";
import React, { useEffect, useState } from "react";

const CompletionCounter: React.FC = () => {
  const { deckCompletionPercentage } = useDeckNotificationContext();
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev < deckCompletionPercentage) {
          return Math.min(prev + 1, deckCompletionPercentage);
        } else if (prev > deckCompletionPercentage) {
          return Math.max(prev - 1, deckCompletionPercentage);
        }
        return prev;
      });
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, [deckCompletionPercentage]);

  return (
    <div id="create-progress">
      <div className="py-2 text-xl text-tolopea dark:text-aquamarine">
        Progress
      </div>
      <div className="flex max-w-[280px] flex-row justify-between rounded-xl bg-electric-violet-200 p-2 dark:bg-mariana-blue-100 sm:max-w-none">
        <progress
          className="max-h-[15px] w-[90%] self-center rounded-full border border-tolopea bg-transparent dark:border-aquamarine sm:max-w-none [&::-webkit-progress-value]:bg-aquamarine"
          value={displayPercent / 100}
          max="1"
        />
        <div className="whitespace-nowrap px-2 text-sm text-tolopea dark:text-aquamarine sm:text-lg">
          {displayPercent} %
        </div>
      </div>
    </div>
  );
};

export { CompletionCounter };
