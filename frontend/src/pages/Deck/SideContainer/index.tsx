import { type DeckSchema } from "@client/models/DeckSchema";
import React, { useEffect, useRef } from "react";

import { FileContainer } from "./FileContainer";
import { QuizContainer } from "./QuizContainer";
import { RelationshipContainer } from "./RelationshipContainer";

interface SideContainerProps {
  deck: DeckSchema;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}
const SideContainer: React.FC<SideContainerProps> = ({
  setIsCollapsed,
  isCollapsed,
  deck,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current != null &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsCollapsed]);

  return (
    <div
      className={`absolute top-0 z-[29]  transition-all duration-500 ${
        isCollapsed ? "right-[-800px] " : "right-[60px] "
      }`}
      ref={containerRef}
    >
      <div className="z-[29] rounded-xl  border-2 border-white bg-electric-violet-200 p-2 text-tolopea dark:border-aquamarine/40 dark:bg-mariana-blue dark:text-white">
        <div className="mx-2 mb-4  ">
          <FileContainer deck={deck} isCollapsed={isCollapsed} />
        </div>
        <hr className=" mx-2 my-1 h-[1px]  border-0 bg-aquamarine dark:bg-aquamarine/40" />
        <div className=" mb-4   ">
          <RelationshipContainer
            deckId={deck.id}
            isCollapsed={isCollapsed}
            childrenIds={deck.children ?? []}
            parentIds={deck.parents ?? []}
          />
        </div>
        <hr className=" mx-2 my-1 h-[1px]  border-0 bg-aquamarine dark:bg-aquamarine/40" />

        <div className="mb-2    ">
          <QuizContainer deckId={deck.id} />
        </div>
      </div>
    </div>
  );
};

export { SideContainer };
