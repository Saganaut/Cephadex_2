import { shuffleArray } from "@utils/functions";
import React, { type SetStateAction, useEffect, useState } from "react";

interface MCQProps {
  content: string;
  answer: string | null;
  handleCardUpdate: (
    answer: string | null,
    setAnswer: React.Dispatch<SetStateAction<string | null>>
  ) => void;
  boc2: string | null;
  boc3: string | null;
  boc4: string | null;
  setAnswer: React.Dispatch<SetStateAction<string | null>>;
}
const MCQ: React.FC<MCQProps> = ({
  answer,
  boc3,
  boc4,
  boc2,
  handleCardUpdate,
  content,
  setAnswer,
}) => {
  const [shuffledValues, setShuffledValues] = useState<Array<string | null>>(
    []
  );
  useEffect(() => {
    // Extract values from the card object
    const valuesToShuffle = [content, boc2, boc3, boc4];
    // Shuffle the values and set the state
    setShuffledValues(shuffleArray(valuesToShuffle));
  }, []);
  return (
    <ul className={"flex w-full flex-col gap-y-[30px]"}>
      {shuffledValues.map((value, index) => (
        <li
          key={index}
          className={`cursor-pointer select-none rounded-full  border-2 py-[12px] text-center text-[18px] transition-all duration-300 ease-in-out   ${
            answer != null && content === value
              ? "border-electric-violet bg-electric-violet "
              : answer != null && content !== value
              ? "border-mariana-blue/50 bg-mariana-blue/50 text-aquamarine/20"
              : "border-aquamarine-100  text-white "
          }`}
          onClick={() => {
            handleCardUpdate(value, setAnswer);
          }}
        >
          {value}
        </li>
      ))}
    </ul>
  );
};
export { MCQ };
