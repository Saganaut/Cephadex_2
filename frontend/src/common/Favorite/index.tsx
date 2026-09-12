import { DeckService } from "@client/services/DeckService";
import { QuizService } from "@client/services/QuizService";
import { Tooltip } from "@common/Form/Tooltip";
import React, { useState } from "react";

import FavIcon from "./assets/favIcon.svg?react";

interface FavoriteTogglerProps {
  itemId: number;
  isFavorite: boolean | undefined;
  itemType?:
    | "group"
    | "standard"
    | "simple"
    | "public"
    | "groupAdmin"
    | "full"
    | "quiz"
    | "card"
    | string;
  toggleFunction?: () => void;
}

const FavoriteToggler: React.FC<FavoriteTogglerProps> = ({
  itemId,
  isFavorite,
  itemType,
  toggleFunction,
}) => {
  const [isFav, setIsFav] = useState(isFavorite);

  const callDeckToggle = async ({
    itemId,
  }: {
    itemId: number;
  }): Promise<void> => {
    const response = await DeckService.toggleFavoriteDeck(itemId);
    setIsFav(response.favorite);
  };

  const callQuizToggle = async ({
    itemId,
  }: {
    itemId: number;
  }): Promise<void> => {
    const response = await QuizService.toggleFavoriteQuiz(itemId);
    setIsFav(response.favorite);
  };

  const callCardToggle = async ({
    itemId,
  }: {
    itemId: number;
  }): Promise<void> => {
    const response = await DeckService.toggleFavoriteCard(itemId);
    setIsFav(response.favorite);
  };

  const toggleClick = async (event: React.MouseEvent): Promise<void> => {
    event.stopPropagation();

    if (itemType === "quiz") {
      await callQuizToggle({ itemId });
      return;
    }
    if (itemType === "card") {
      await callCardToggle({ itemId });
      return;
    }
    if (itemType === "public") {
      if (toggleFunction != null) {
        const response = toggleFunction();
        setIsFav(!(isFav ?? false));
        return;
      }
    }
    await callDeckToggle({ itemId });
  };
  const tooltipText = itemType === "public" ? "Like" : "Favorite";

  return (
    <>
      <Tooltip text={tooltipText}>
        <FavIcon
          className={`cursor-pointer ${
            isFav ?? false
              ? "fill-tolopea dark:fill-aquamarine"
              : "fill-electric-violet-700 dark:fill-blaze-orange"
          }`}
          onClick={toggleClick}
        />
      </Tooltip>
    </>
  );
};

export { FavoriteToggler };
