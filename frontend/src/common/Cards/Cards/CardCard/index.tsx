import { EditCardContentModal } from "@common/Modals/EditCardContentModal";
import type { CardSchema } from "@source/client";
import { selectCardsById } from "@source/lib/store/cards/cardsSlice";
import { useAppSelector } from "@source/lib/store/hooks";
import React, { type ReactElement, useState } from "react";

import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface CardCardProps {
  card: CardSchema;
  deckId: number | undefined;
  cardType?: "public" | "private" | "standard";
}
// TODO : need a better way then setitng id to 0 - this is a ridiculous way to do things

const CardCard: React.FC<CardCardProps> = ({
  card,
  deckId,
  cardType,
}): ReactElement => {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const activeCard = useAppSelector((state) => selectCardsById(state, card.id)) || card;
  return (
    <div
      className={
        "flex size-full cursor-pointer flex-col  rounded-[10px]  bg-aquamarine-100 px-[26px] py-[16px] transition-all duration-100 ease-linear hover:bg-aquamarine-900 dark:bg-tolopea dark:hover:bg-electric-violet"
      }
      onClick={() => {
        setEditModalIsOpen(true);
      }}>
      <div className={"w-full"}>
        <Header card={activeCard} deckId={deckId ?? 0} cardType={cardType} />
        <div className={"flex items-center gap-x-[16px] pt-[20px]"}>
          <Body card={activeCard} />
        </div>
        <div className={"mt-[20px] flex w-full items-center justify-between"}>
          <Footer card={activeCard} />
        </div>
      </div>
      {cardType !== "public" && (
        <EditCardContentModal
          // handleUpdateSchema={handleUpdateSchema}
          isOpen={editModalIsOpen}
          setIsOpen={setEditModalIsOpen}
          activeCard={activeCard}
          deckId={String(deckId ?? "")}
          type={"Cards"}
        />
      )}
    </div>
  );
};
export { CardCard };
