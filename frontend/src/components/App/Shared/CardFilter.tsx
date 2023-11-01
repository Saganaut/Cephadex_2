import { type Card } from "@source/types/Globals";

const filterCards = (cardsData: Card[], filter: string): Card[] => {
  console.log("entered filterCards");
  if (!Array.isArray(cardsData)) {
    console.log("not array");
    return [];
  }
  if (filter === "") return cardsData;
  if (filter === "saved") return cardsData.filter((card) => card.fav);
  return cardsData.filter((card) => card.type === filter);
};

export { filterCards };
