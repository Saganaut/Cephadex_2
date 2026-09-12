import { ErrorMessage } from "@source/common/InfoComponents/ErrorMessage";
import { CardDisplay } from "@source/common/SelectACard/CardDisplay";
import { useFetchCards } from "@source/lib/hooks/deckHooks/useFetchCards";
import React from "react";

import { DeckControls } from "../DeckControls";
import { TopRow } from "../TopRow";

const sortOptions = [
  {
    value: 0,
    label: "Date",
  },
  {
    value: 1,
    label: "Term",
  },
];

interface CardContainerProps {
  onCardClick: (cardId: number) => void;
  deckId: number;
}

const CardContainer: React.FC<CardContainerProps> = ({ deckId }) => {
  const { cardsStatus, setFetchParams, fetchParams, pages, orderedCards } =
    useFetchCards({
      deckId,
    });
  // if (cardsStatus === 'loading') {
  //     return (
  //         <>
  //             <Loading />{' '}
  //         </>
  //     )
  // }
  if (cardsStatus === "failed") {
    return (
      <>
        <ErrorMessage
          title='Cards not found'
          message='We were unable to retrieve your cards, please try again or contact support'
        />
      </>
    );
  }
  const handleCardClick = (cardId: number): void => {};
  return (
    <>
      <div className='fixed bottom-0 left-0 z-50 h-24 w-full rounded-t-xl border-t-2 border-t-white/40 bg-electric-violet-500 dark:bg-mariana-blue sm:hidden'>
        <div className='mx-10 mb-8 mt-6'>
          <TopRow
            searchPlaceholder={"Search"}
            sortOptions={sortOptions}
            withSort={false}
            withSearch={true}
            fetchParams={fetchParams}
            setFetchParams={setFetchParams}
          />
        </div>
      </div>
      <div className={`rounded-[18px]`}>
        <div
          id='deck-controls'
          className={
            "mb-5 w-full flex-col items-center justify-between sm:flex xl:flex-row"
          }>
          <DeckControls deckId={deckId} />
        </div>
        <div className={`grow transition-all duration-1000`}>
          <CardDisplay
            cards={orderedCards}
            setFetchParams={setFetchParams}
            fetchParams={fetchParams}
            onCardClick={handleCardClick}
            sortOptions={sortOptions}
            pages={pages}
          />
        </div>
      </div>
    </>
  );
};

const MemoizedCardContainer = CardContainer;

// React.memo(
//     CardContainer,
//     (prevProps, nextProps) => {
//         return (
//             prevProps.deckId === nextProps.deckId &&
//             prevProps.onCardClick === nextProps.onCardClick
//         )
//     }
// )

export { MemoizedCardContainer };
