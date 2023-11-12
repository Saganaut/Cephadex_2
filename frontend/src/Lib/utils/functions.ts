import { type Card } from "@customTypes/Deck";

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

// Returns The New Card Data after it has been decremented
// Gets Called If the answer is Incorrect!
export const decrementCardFunction = (card: Card): Card => {
  const updatedCard = Object.assign({}, card);

  updatedCard["times-asked"] += 1;
  updatedCard["times-correct_row"] = 0;
  if (updatedCard["box-id"] === 1) {
    updatedCard["srs-interval"] *= 0.5;
  }
  if (updatedCard["box-id"] === 2) {
    updatedCard["srs-interval"] *= 0.8;
  }
  if (updatedCard["box-id"] === 3) {
    updatedCard["srs-interval"] *= 0.9;
  }

  if (updatedCard["box-id"] !== 1 && updatedCard["srs-interval"] < 5) {
    updatedCard["srs-interval"] = 5;
  }

  if (updatedCard["box-id"] > 0) {
    updatedCard["box-id"] -= 1;
  }

  updatedCard["time-updated"] = new Date().toISOString().slice(0, 19);

  return updatedCard;
};
// Returns The New Card Data after it has been incremented
// Gets Called If the answer is Correct!
export const incrementCardFunction = (card: Card): Card => {
  const updatedCard = Object.assign({}, card);

  updatedCard["times-correct"] += 1;
  updatedCard["times-asked"] += 1;
  updatedCard["times-correct_row"] += 1;

  if (updatedCard["times-correct_row"] > 2) {
    updatedCard["box-id"] += 1;
    updatedCard["box-id"] = Math.min(updatedCard["box-id"], 3);
  }
  if (updatedCard["box-id"] === 0) {
    updatedCard["srs-interval"] *= 2;
  }

  if (updatedCard["box-id"] === 1) {
    updatedCard["srs-interval"] *= 4;
  }
  if (updatedCard["box-id"] === 2) {
    updatedCard["srs-interval"] *= 6;
  }
  if (updatedCard["box-id"] === 3) {
    updatedCard["srs-interval"] *= 10;
  }

  updatedCard["srs-interval"] = Math.min(updatedCard["srs-interval"], 525600);
  if (updatedCard["times-correct_row"] > 3) {
    updatedCard["srs-interval"] += 1440;
  }

  updatedCard["time-updated"] = new Date().toISOString().slice(0, 19);
  return updatedCard;
};
