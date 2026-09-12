import { type DeckSchema } from "@client/models/DeckSchema";
import { DeckCard } from "@common/Cards/Decks/DeckCard";
import { CardViewerModal } from "@source/common/Modals/CardViewerModal";
import { SelectWrapper } from "@source/common/SelectWrapper";
import { AnimatePresence, motion } from "framer-motion";
import React, { type SetStateAction } from "react";

interface GroupContentProps {
  groupId: number;
  permission: string;
  deckSearchQuery: string;
  sortedArray: DeckSchema[] | undefined;
  setDeckSearchQuery: (val: string) => void;
  setSortValue:
    | React.Dispatch<SetStateAction<{ value: number; label: string }>>
    | undefined;
  setSortedArray:
    | React.Dispatch<SetStateAction<{ value: number; label: string }>>
    | undefined;
  sortValue: { value: number; label: string };
  sortOptions: Array<{ value: number; label: string }> | undefined;
  dataArray?: DeckSchema[] | null;
}

const GroupContent: React.FC<GroupContentProps> = ({
  groupId,
  permission,
  deckSearchQuery,
  sortedArray,
  setDeckSearchQuery,
  setSortedArray,
  setSortValue,
  sortValue,
  sortOptions,
  dataArray,
}) => {
  const [cardViewerIsOpen, setCardViewerIsOpen] = React.useState(false);
  const [selectedDeck, setSelectedDeck] = React.useState<DeckSchema | null>(
    null
  );
  const onDeckClick = (deck: DeckSchema): void => {
    setSelectedDeck(deck);
    setCardViewerIsOpen(true);
  };

  const type = permission === "write" ? "groupAdmin" : "group";
  return (
    <SelectWrapper
      title="Select a deck"
      withFilter={true}
      searchPlaceHolder={"Search For Decks"}
      dataArray={dataArray}
      sortOptions={sortOptions}
      sortValue={sortValue}
      setSortValue={setSortValue}
      setSortedArray={setSortedArray}
      setFilterValue={setDeckSearchQuery}
    >
      <div className={"sm:mb-0 mb-[80px]"}>
        <div className={"w-full"}>
          <div className={"grid h-full w-full md:grid-cols-2"}>
            {" "}
            <AnimatePresence>
              {sortedArray
                ?.filter((deck) =>
                  deck.name
                    .toUpperCase()
                    .includes(deckSearchQuery.toUpperCase())
                )

                .map((deck, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ delay: 0.05 * index, ease: "easeOut" }}
                    onClick={() => {
                      onDeckClick(deck);
                    }}
                    key={deck.id}
                    className="mx-auto mb-8 w-full px-2"
                  >
                    <DeckCard
                      groupId={groupId}
                      deck={deck}
                      type={type}
                      isCard={true}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          {sortedArray != null && sortedArray?.length <= 0 && (
            <div className={"mx-auto text-center font-medium text-white"}>
              <p>There are no decks in this group yet.</p>
            </div>
          )}
        </div>
        {selectedDeck !== null && (
          <CardViewerModal
            isOpen={cardViewerIsOpen}
            setIsOpen={setCardViewerIsOpen}
            deck={selectedDeck}
          />
        )}
      </div>
    </SelectWrapper>
    //   <div className="border h-full w-full border-1 border-red-500">
    //     <h1 className="pb-2 font-medium text-white">
    //       Group decks ({decks.length})
    //     </h1>
    //     <div className={"grid h-full w-full grid-cols-3"}>
    //       {decks.map((deck) => (
    //         <div key={deck.id} className="mx-auto mb-8 w-full px-2">
    //           <DeckCardGroup groupId={groupId} deck={deck} />
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </>
  );
};

export { GroupContent };
