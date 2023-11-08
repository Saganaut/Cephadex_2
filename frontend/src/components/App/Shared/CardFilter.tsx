import { type Card } from "@source/types/Globals";
import { logger } from "@source/Lib/utils/Logger";

const filterCards = (cardsData: Card[], filter: string): Card[] => {
  logger.log("filterCards");
  if (!Array.isArray(cardsData)) {
    return [];
  }
  if (filter === "") return cardsData;
  if (filter === "saved") return cardsData.filter((card) => card.fav);
  return cardsData.filter((card) => card.type === filter);
};

export { filterCards };
