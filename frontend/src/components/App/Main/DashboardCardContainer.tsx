import { CardDefault } from "@app/Shared/CardDefault";
import { filterCards } from "@app/Shared/CardFilter";
import { CardProfile } from "@app/Shared/CardProfile";
import { useFilter } from "@contexts/FilterContext";
import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";
import { fetchGroupsThunk } from "@services/Api/Group/GroupApiThunks";
import { fetchQuizzesThunk } from "@services/Api/Quiz/QuizApiThunks";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { type Deck } from "@source/types/Deck";
import { type Group } from "@source/types/Group";
import { type Quiz } from "@source/types/Quiz";
import { logger } from "@source/Lib/utils/Logger";

const DashboardCardContainer = (): ReactElement => {
  logger.log("DashboardCardContainer");
  const { filter } = useFilter();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector((state) => state.quizzes);
  const decks = useAppSelector((state) => state.decks);
  const groups = useAppSelector((state) => state.groups);
  const [filteredCardsData, setFilteredCardsData] = useState<
    Array<Group | Deck | Quiz>
  >([]);
  // logger.log("filteredCardsData", "DashboardCardContainer", filteredCardsData);
  useEffect(() => {
    dispatch(fetchQuizzesThunk());
    dispatch(fetchDecksThunk());
    dispatch(fetchGroupsThunk());
  }, [dispatch]);

  useEffect(() => {
    const combinedData = [...quizzes.quizzes, ...decks.decks, ...groups.groups];
    const filteredData = filterCards(combinedData, filter);
    setFilteredCardsData(filteredData);
  }, [quizzes, decks, groups, filter]);

  const cardsData = useAppSelector((state) => state.dashboardCards);
  const cardsDataRef = useRef(cardsData);

  useEffect(() => {
    cardsDataRef.current = cardsData;
  }, [cardsData]);

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
