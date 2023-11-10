import React, { useEffect, useState } from "react";

const shuffleMCQ = (array: Array<string | null>): Array<string | null> => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

interface MCQProps {
  content: string;
  answer: string | null;
  handleCardUpdate: (answer: string | null) => void;
  boc2: string | null;
  boc3: string | null;
  boc4: string | null;
}
const MCQ: React.FC<MCQProps> = ({
  answer,
  boc3,
  boc4,
  boc2,
  handleCardUpdate,
  content,
}) => {
  const [shuffledValues, setShuffledValues] = useState<Array<string | null>>(
    []
  );
  useEffect(() => {
    // Extract values from the card object
    const valuesToShuffle = [content, boc2, boc3, boc4];
    // Shuffle the values and set the state
    setShuffledValues(shuffleMCQ(valuesToShuffle));
  }, []);
  return (
    <ul>
      {shuffledValues.map((value, index) => (
        <li
          key={index}
          className={`${
            answer != null && content === value
              ? "text-green-500"
              : answer != null && content !== value
              ? "text-red-700"
              : "text-white"
          }`}
          onClick={() => {
            handleCardUpdate(value);
          }}
        >
          {String.fromCharCode(65 + index)} - {value}
        </li>
      ))}
    </ul>
  );
};
export { MCQ };
