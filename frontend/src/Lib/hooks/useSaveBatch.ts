import { type Card } from "@customTypes/Deck";
import { useEffect, useState } from "react";

export const useSaveBatch = (): ((data: Card) => void) => {
  const [cardsBatch, setCardsBatch] = useState<Card[]>([]);
  // Effect to load the array from localStorage on component mount
  useEffect(() => {
    const storedArray = localStorage.getItem("cardsBatch");

    if (typeof storedArray === "string") {
      const parsedData = JSON.parse(storedArray);
      setCardsBatch(parsedData);
    } else {
      setCardsBatch([]);
    }
  }, []);

  // Function to handle pushing data and updating localStorage
  const handlePushData = (data: Card): void => {
    // Push data onto the array
    const newArray = [...cardsBatch, data];
    console.log("newArray: ", newArray);
    // Update state and localStorage
    setCardsBatch(newArray);
    localStorage.setItem("cardsBatch", JSON.stringify(newArray));

    // Check if the array reaches a length of 20
    if (newArray.length === 20) {
      handleArrayLength20();
    }
  };

  // Function to be triggered when the array reaches a length of 20
  const handleArrayLength20 = (): void => {
    // Your logic when the array reaches a length of 20
    console.log("Array reached a length of 20!");
  };

  return handlePushData;
};
