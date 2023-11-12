import { type Card } from "@source/types/Deck";
import { useEffect, useState } from "react";

export const useSaveBatch = (): ((data: Card) => void) => {
  const [cardsBatch, setCardsBatch] = useState<Card[]>([]);

  useEffect(() => {
    // Function to get the stored array from localStorage

    const storedArray = localStorage.getItem("cardsBatch");
    if (storedArray != null) {
      setCardsBatch(JSON.parse(storedArray));
    }
  }, []);

  const handlePushData = (data: Card): void => {
    // Check if the data already exists in the array
    const isDuplicate = cardsBatch.some((card) => card.id === data.id);

    // In case of a def card, the card could be updated if it already exists in the array
    const isDefCard = data.category === "Definitions";

    if (!isDuplicate) {
      // Push data onto the array
      const newArray = [...cardsBatch, data];

      // Update state and localStorage
      setCardsBatch(newArray);
      localStorage.setItem("cardsBatch", JSON.stringify(newArray));

      // Check if the array reaches a length of 20
      if (newArray.length === 20) {
        handleArrayLength20();
      } else {
        console.log("Data already exists in the array.");
        // You can handle the case where the data already exists in the array
      }
    }
    if (isDuplicate && isDefCard) {
      // Find the existing card
      const existingCard = cardsBatch.find((card) => card.id === data.id);

      // Update the existing card with the new added one
      const updatedCard = {
        ...existingCard,
        ...data,
      };

      // Add the updated card in place of the existing one
      const newArray = cardsBatch.map((card) =>
        card.id === data.id ? updatedCard : card
      );

      // Update state and localStorage
      setCardsBatch(newArray);
      localStorage.setItem("cardsBatch", JSON.stringify(newArray));

      // Check if the array reaches a length of 20
      if (newArray.length === 20) {
        handleArrayLength20();
      } else {
        console.log("Data already exists in the array.");
        // You can handle the case where the data already exists in the array
      }
    }
  };

  const handleArrayLength20 = (): void => {
    console.log("Array reached a length of 20!");
    // Your logic when the array reaches a length of 20
  };

  return handlePushData;
};
