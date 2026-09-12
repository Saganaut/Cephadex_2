import { type DeckSchema } from "@client/models/DeckSchema";
import { Filter } from "@common/Form/Filter";
import type ExtractFormValues from "@extract/data/ExtractFormValues";
import { RadioGroup } from "@headlessui/react";
import { DeckCard } from "@source/common/Cards/Decks/DeckCard";
import { useFormikContext } from "formik";
import React, { type ReactElement, useState } from "react";

const sortOptions = [
  {
    value: 0,
    label: "Date",
  },
  {
    value: 1,
    label: "Name",
  },
];
interface ExistingDeckProps {
  decks: DeckSchema[];
}

const ExistingDeck = ({ decks }: ExistingDeckProps): ReactElement => {
  const formik = useFormikContext<ExtractFormValues>();
  const deck = formik.values.existingDeckField;
  const [sortedArray, setSortedArray] = useState<DeckSchema[]>();
  const [deckSearchQuery, setDeckSearchQuery] = useState("");

  const [sortValue, setSortValue] = useState({
    value: 0,
    label: "Date",
  });
  // const [order, setOrder] = useState<"desc" | "asc">("desc");
  return (
    <div>
      <div className="flex justify-end rounded-2xl p-2 dark:bg-mariana-blue">
        <div className="justify-end">
          <Filter
            searchPlaceHolder={"Search for a deck"}
            setSortedArray={setSortedArray}
            dataArray={decks}
            setSortValue={setSortValue}
            sortValue={sortValue}
            sortOptions={sortOptions}
            setFilterValue={setDeckSearchQuery}
          />
        </div>
      </div>
      <RadioGroup
        name="cardTypeField"
        value={deck}
        onChange={(value) => {
          void formik.setFieldValue("existingDeckField", value);
        }}
        onBlur={formik.handleBlur}
      >
        <RadioGroup.Label>
          {" "}
          <div className="flex  p-2 pb-4">
            <div className=" text-tolopea dark:text-aquamarine">
              Select one of your existing decks
            </div>
          </div>
        </RadioGroup.Label>
        <div className="grid md:grid-cols-3">
          {sortedArray
            ?.filter((deck) =>
              deck.name.toUpperCase().includes(deckSearchQuery.toUpperCase())
            )
            .slice(0, 3)
            .map((deck, index) => (
              <div
                key={index}
                className="mx-auto mb-2 w-full max-w-md px-2 sm:mb-8"
              >
                <RadioGroup.Option value={deck.id}>
                  {({ checked }) => (
                    <DeckCard deck={deck} checked={checked} type="simple" />
                  )}
                </RadioGroup.Option>
              </div>
            ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export { ExistingDeck };
