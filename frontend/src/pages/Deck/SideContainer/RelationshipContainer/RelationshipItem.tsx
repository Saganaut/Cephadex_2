import CIcon from "@assets/cardTypeIcons/CIcon.svg?react";
import PIcon from "@assets/cardTypeIcons/PIcon.svg?react";
import MinusCircle from "@assets/MinusCircle.svg?react";
import { type DeckSchema } from "@source/client";
import { deleteDeckRelationship } from "@source/lib/store/decks/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React from "react";
import { useNavigate } from "react-router-dom";

interface RelationshipItemProps {
  deck: DeckSchema;
  type: "parent" | "child";
  mainDeckId: number;
}
const RelationshipItem: React.FC<RelationshipItemProps> = ({
  mainDeckId,
  deck,
  type,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleDeleteRelationship = (): void => {
    if (type === "child") {
      void dispatch(
        deleteDeckRelationship({
          parentId: mainDeckId,
          childId: Number(deck.id),
        })
      );
    } else {
      void dispatch(
        deleteDeckRelationship({
          parentId: Number(deck.id),
          childId: mainDeckId,
        })
      );
    }
  };

  return (
    <>
      <div className="flex max-w-[200px] items-center justify-between rounded-full p-1 sm:max-w-[400px]">
        <div
          className={"flex cursor-pointer items-center"}
          onClick={() => {
            navigate(`/deck/${deck.id}`);
          }}
        >
          {type === "parent" ? (
            <PIcon className="h-6 w-6" />
          ) : (
            <CIcon className="h-6 w-6" />
          )}
          <h1
            className={
              " hover:mariana-blue  pl-[12px] pr-[20px] text-xs  dark:hover:text-blaze-orange sm:text-base"
            }
          >
            {deck.name}
          </h1>
        </div>
        <MinusCircle
          className="h-[20px] w-[20px] cursor-pointer  hover:scale-105"
          onClick={handleDeleteRelationship}
        />{" "}
      </div>
    </>
  );
};

export { RelationshipItem };
