import { CardDefault } from "@app/Shared/CardDefault";
import { filterCards } from "@app/Shared/CardFilter";
import { CardProfile } from "@app/Shared/CardProfile";
import { useFilter } from "@contexts/FilterContext";
import { fetchAllDecks } from "@services/Api/Deck/DeckApi";
import { fetchAllQuizzes } from "@services/Api/Quiz/QuizApi";
import { setCards } from "@store/cardSlice";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CardContainer = (): ReactElement => {
  const { filter } = useFilter();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const cardsData = useSelector((state) => state.cards);
  const filteredCardsData = filterCards(cardsData, filter);

  const cardsDataRef = useRef(cardsData);

  useEffect(() => {
    cardsDataRef.current = cardsData;
  }, [cardsData]);

  useEffect(() => {
    const fetchData = async () => {
      const [quizzes, decks] = await Promise.all([
        fetchAllQuizzes(),
        fetchAllDecks(),
      ]);
      dispatch(setCards([...quizzes, ...decks]));
    };

    if (cardsDataRef.current.length === 0) {
      fetchData();
    }
  }, [dispatch]);

  let insertProfileAtIndex;
  if (windowWidth >= 1280) {
    insertProfileAtIndex = 3;
  } else if (windowWidth >= 1024) {
    insertProfileAtIndex = 2;
  } else if (windowWidth >= 768) {
    insertProfileAtIndex = 1;
  } else {
    insertProfileAtIndex = 0;
  }

  const orderedData = [...filteredCardsData];
  orderedData.splice(insertProfileAtIndex, 0, { isProfile: true });

  return (
    <div className="flex flex-wrap">
      {orderedData.map((card) => {
        if (card.isProfile) {
          return (
            <div
              key="profile"
              className="flex w-full items-center justify-center p-4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <CardProfile />
            </div>
          );
        } else {
          const uniqueKey = card.type + card.id;
          return (
            <div
              key={uniqueKey}
              className="flex w-full items-center justify-center p-4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <CardDefault data={card} />
            </div>
          );
        }
      })}
    </div>
  );
};

export { CardContainer };
