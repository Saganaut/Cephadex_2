import React, { useState, useEffect, useRef } from "react";
import { CardDefault } from "@app/Shared/CardDefault";
import { CardProfile } from "@app/Shared/CardProfile";
import { fetchAllQuizzes } from "@services/Api/Quiz/QuizApi";
import { fetchAllDecks } from "@services/Api/Deck/DeckApi";
import { setCards } from "@store/cardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFilter } from "@contexts/FilterContext";
import { filterCards } from "@app/Shared/CardFilter";

const CardContainer = () => {
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

  let orderedData = [...filteredCardsData];
  orderedData.splice(insertProfileAtIndex, 0, { isProfile: true });

  return (
    <div className="flex flex-wrap">
      {orderedData.map((card) => {
        if (card.isProfile) {
          return (
            <div
              key="profile"
              className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-full p-4 flex justify-center items-center"
            >
              <CardProfile />
            </div>
          );
        } else {
          const uniqueKey = card.type + card.id;
          return (
            <div
              key={uniqueKey}
              className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-full p-4 flex justify-center items-center"
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
