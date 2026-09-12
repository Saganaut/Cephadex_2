import { PreferencesSelect } from "@source/common/Form/PreferencesSelect/PreferencesSelect";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";
import { ExportAnki } from "./ExportAnki";
import { ExportCSV } from "./ExportCSV";

const options = [
  { label: "CSV", value: "csv", icon: null },

  { label: "Anki", value: "anki", icon: null },
];

const ExportDeckModal: React.FC = () => {
  const { exportDeckModalIsOpen, setExportDeckModalIsOpen, deckId } =
    useDeckContexts();
  const [activeIndex, setActiveIndex] = React.useState(0);
  return (
    <ModalWrapper
      isOpen={exportDeckModalIsOpen}
      setIsOpen={setExportDeckModalIsOpen}
    >
      <div
        className={
          "mx-auto  my-[18px] h-auto rounded-2xl px-[32px] text-white  sm:min-h-[40vh] sm:min-w-[40vw]"
        }
      >
        <div className="flex justify-evenly p-2">
          <PreferencesSelect
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            options={options}
            label={"Choose how to export your deck"}
          />
        </div>
        {activeIndex === 0 && <ExportCSV deckId={deckId} />}
        {activeIndex === 1 && <ExportAnki deckId={deckId} />}
      </div>
    </ModalWrapper>
  );
};

export { ExportDeckModal };
