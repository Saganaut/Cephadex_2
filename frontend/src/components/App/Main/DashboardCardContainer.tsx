import { CardDefault } from "@app/Shared/CardDefault";
import { filterCards } from "@app/Shared/CardFilter";
import { CardProfile } from "@app/Shared/CardProfile";
import { useFilter } from "@contexts/FilterContext";
import { fetchAllDecks } from "@services/Api/Deck/DeckApi";
import { fetchAllQuizzes } from "@services/Api/Quiz/QuizApi";
import { setDashboardCards } from "@source/store/dashboardCardSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const DashboardCardContainer = (): ReactElement => {
  const { filter } = useFilter();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useAppDispatch();
  const cardsData = useAppSelector((state) => state.dashboardCards);
  const filteredCardsData = filterCards(cardsData, filter);

  const cardsDataRef = useRef(cardsData);

  useEffect(() => {
    cardsDataRef.current = cardsData;
  }, [cardsData]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const [quizzes, decks] = await Promise.all([
        fetchAllQuizzes(),
        fetchAllDecks(),
      ]);
      dispatch(setDashboardCards([...quizzes, ...decks]));
    };

    if (cardsDataRef.current.length === 0) {
      void fetchData();
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
            <Link
              key={uniqueKey}
              to={`/${card.type}/${card.id}`}
              className="flex w-full items-center justify-center p-4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <>
                <CardDefault data={card} />
              </>
            </Link>
          );
        }
      })}
    </div>
  );
};

export { DashboardCardContainer };
