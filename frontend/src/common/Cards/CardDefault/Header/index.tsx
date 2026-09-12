import GroupIcon from "@assets/GroupOctopusIcon.svg?react";
import { QuizDropdown } from "@common/DropdownMenu/QuizDropdown";
import {
  type DeckSchema,
  type GroupSchema,
  type QuizSchema,
} from "@source/client";
import { DeckDropdown } from "@source/common/DropdownMenu/DeckDropdown";
import { truncate } from "@utils/functions";
import React from "react";

import { Icon } from "./Icon";

interface HeaderProps {
  data: DeckSchema | QuizSchema | GroupSchema;
  style?: string;
}
const Header: React.FC<HeaderProps> = ({ data, style }) => {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className={"flex items-center gap-x-[8px]"}>
          <h1 className="text-lg font-medium">{truncate(data.name, 25)}</h1>
        </div>

        {data.type === "Deck" && (
          <div className={"relative"}>
            <DeckDropdown deckId={data.id} type="standard" />
          </div>
        )}
        {data.type === "Quiz" && (
          <div
            className={"relative"}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <QuizDropdown quiz={data as QuizSchema} />
          </div>
        )}
      </div>
      <Icon data={data} />
    </>
  );
};

export { Header };
