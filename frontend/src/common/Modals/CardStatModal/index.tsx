import DeckIcon from "@source/assets/DeckIcon.svg?react";
import { ErrorMessage } from "@source/common/InfoComponents/ErrorMessage";
import { useCardContext } from "@source/lib/contexts/CardContext";
import { formatDate } from "@source/lib/utils/functions";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";
import { ContentRow, DataRow } from "./DataRow";

const CardStatModal: React.FC = () => {
  const { isCardStatModalOpen, setIsCardStatModalOpen, card } =
    useCardContext();

  // TODO find better way to do this
  if (card == null) {
    return;
  }

  return (
    <>
      <ModalWrapper
        isOpen={isCardStatModalOpen}
        setIsOpen={setIsCardStatModalOpen}
      >
        <div className={"lg:mx-auto py-12 lg:w-[60vw] md:px-[126px]"}>
          <h1 className={"pb-4 text-2xl font-bold"}>Card Data</h1>
          <div
            className={
              "mb-10 flex w-full items-center text-white lg:justify-between justify-start"
            }
          >
            <div className="hidden lg:block ">
              {card.img != null ? (
                <img src={card.img} className={"h-40 w-40"} alt="card" />
              ) : (
                <DeckIcon className={"h-40 w-40"} />
              )}
            </div>
            <div className={"flex items-center justify-start px-8"}>
              <ul className="text-start">
                <ContentRow label="Front" data={card.term} />
                {card.content != null && (
                  <ContentRow label="Back" data={card.content} />
                )}
                {card.boc2 != null && (
                  <ContentRow label="Back 2" data={card.boc2} />
                )}
                {card.boc3 != null && (
                  <ContentRow label="Back 3" data={card.boc3} />
                )}
                {card.boc4 != null && (
                  <ContentRow label="Back 4" data={card.boc4} />
                )}
                {card.formula != null && (
                  <ContentRow label="Formula" data={card.formula} />
                )}
              </ul>
            </div>
          </div>
          <div className=" md:flex-nowrap flex-wrap justify-evenly gap-5 rounded-xl border-electric-violet-700 p-4 dark:border-white md:border-2">
            <ul>
              <DataRow label="Category" data={card.category ?? ""} />
              <DataRow label="Subject" data={card.subject ?? ""} />
              <DataRow label="Topic" data={card.topic ?? ""} />
              <DataRow label="Custom front" data={card.customFront ?? ""} />
              <DataRow label="Custom back" data={card.customBack ?? ""} />
              <DataRow label="Language" data={card.language ?? ""} />
              <DataRow label="SRS interval" data={card.srsInterval} />
              <DataRow label="Difficulty" data={card.diffLvl} />
            </ul>
            <ul>
              <DataRow label="Learning level" data={card.boxId ?? ""} />
              <DataRow label="Times asked" data={card.timesAsked} />
              <DataRow label="Times correct" data={card.timesCorrect} />
              <DataRow
                label="Times correct in a row"
                data={card.timesCorrectRow}
              />
              <DataRow label="Created on" data={formatDate(card.timeCreated)} />
              <DataRow
                label="Updated on"
                data={formatDate(card.timeUpdated ?? "")}
              />
              <DataRow label="Edited" data={String(card.edited)} />
              <DataRow label="Favorite" data={String(card.fav)} />
              <DataRow label="Create method" data={card.createMethod ?? ""} />
            </ul>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export { CardStatModal };
