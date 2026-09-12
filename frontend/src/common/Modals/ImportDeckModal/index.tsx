import { PreferencesSelect } from "@source/common/Form/PreferencesSelect/PreferencesSelect";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";
import { ImportAnki } from "./ImportAnki";
import { ImportCSV } from "./ImportCSV";
import { ImportDeck } from "./ImportDeck";

const options = [
  { label: "CSV", value: "csv", icon: null },
  {
    label: "Deck",
    value: "deck",
    icon: null,
  },
  { label: "Anki", value: "anki", icon: null },
];

const ImportDeckModal: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const { importDeckModalIsOpen, setImportDeckModalIsOpen, deckId } =
    useDeckContexts();

  return (
    <>
      <ModalWrapper
        isOpen={importDeckModalIsOpen}
        setIsOpen={setImportDeckModalIsOpen}
      >
        <div
          className={
            "relative mx-auto rounded-[24px] py-[18px]   sm:min-h-[40vh] sm:min-w-[40vw]"
          }
        >
          <div className="px:[32px] flex  justify-evenly pb-[18px] lg:px-[96px]">
            <PreferencesSelect
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              options={options}
              label={"Choose Import Method"}
            />
          </div>
          <div className={"mb-[18px] h-[1px] w-full bg-slate-700"}></div>
          {activeIndex === 0 && <ImportCSV deckId={deckId} />}
          {activeIndex === 1 && <ImportDeck deckId={deckId} />}
          {activeIndex === 2 && <ImportAnki deckId={deckId} />}
        </div>
      </ModalWrapper>
    </>
  );
};

export { ImportDeckModal };
