import { PreferencesSelectSecondary } from "@source/common/Form/PreferencesSelect/PreferencesSelectSecondary";
import { useFetchDecks } from "@source/lib/hooks/deckHooks/useFetchDecks";
import React, { type ReactElement, useState } from "react";

import { ExistingDeck } from "./ExistingDeck";
import { MoreOptions } from "./MoreOptions";
import { NewDeck } from "./NewDeck";

const options = [
  {
    label: "New deck",
    value: "new",
    tooltip: "Choose this option to put the content in a new deck",
  },
  {
    label: "Existing deck",
    value: "existing",
    tooltip: "Choose this option to put the content in an existing deck",
  },
];

const ExtractStepTwo = (): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { decks } = useFetchDecks();

  const availableOptions =
    decks.length > 0 ? options : options.filter((o) => o.value !== "existing");

  return (
    <div>
      <div className="mb-2 min-h-[350px] rounded-xl bg-electric-violet-200/40 p-4 dark:bg-mariana-blue">
        <div className="p-5 text-xl text-tolopea dark:text-aquamarine sm:text-2xl">
          {activeIndex === 0 && "Create a new deck"}
          {activeIndex === 1 && "Use an existing deck"}
        </div>
        <PreferencesSelectSecondary
          id="new-existing-deck"
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          label=""
          options={availableOptions}
        />
        <>
          {activeIndex === 0 && <NewDeck />}
          {activeIndex === 1 && decks.length > 0 && (
            <ExistingDeck decks={decks} />
          )}
        </>
      </div>
      <div
        id="create-more-options"
        className=" rounded-xl bg-electric-violet-200/40 p-4 dark:bg-mariana-blue"
      >
        <MoreOptions />
      </div>
    </div>
  );
};

export { ExtractStepTwo };
