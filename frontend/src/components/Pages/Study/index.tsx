import { Filter } from "@pages/Study/components/Filter";
import { Heading } from "@pages/Study/components/Heading";
import React, { type ReactElement } from "react";

import { DeckCard } from "./components/DeckCard";

const sortOptions: Array<{ value: number; label: string }> = [
  { value: 0, label: "None" },
  { value: 1, label: "Male" },
  { value: 2, label: "Female" },
  { value: 3, label: "Other" },
];
function Study(): ReactElement {
  return (
    <div className={"mt-[140px] w-full"}>
      <div
        className={
          "relative w-full rounded-[18px] bg-mariana-blue px-[32px] pb-[65px] pt-[40px]"
        }
      >
        <Heading />

        <Filter sortOptions={sortOptions} />

        <div className={"w-full"}>
          <h1 className={"pb-2 font-medium text-white"}>Select deck</h1>
          <div
            className={"flex w-full items-center justify-between gap-x-[38px]"}
          >
            {/* DECKS */}
            <DeckCard />
            <DeckCard />
            <DeckCard />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Study;
