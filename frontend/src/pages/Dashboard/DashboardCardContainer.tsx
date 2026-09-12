import { filterDeckCards } from "@common/CardFilter";
import useWindowResize from "@hooks/useWindowResize";
import type { DeckSchema, GroupSchema, QuizSchema } from "@source/client";
import { CardDefault } from "@source/common/Cards/CardDefault";
import { CardProfile } from "@source/common/Cards/CardProfile";
import { useFetchDecks } from "@source/lib/hooks/deckHooks/useFetchDecks";
import { useFetchGroups } from "@source/lib/hooks/groupHooks/useFetchgroups";
import { useFetchQuizzes } from "@source/lib/hooks/quizzesHooks/useFetchQuizzes";
import React, { type ReactElement, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardCardContainerProps {
  filterValue: string;
}
type CardData = DeckSchema | QuizSchema | GroupSchema | { isProfile: true };

const DashboardCardContainer = ({
  filterValue,
}: DashboardCardContainerProps): ReactElement => {
  const { decks } = useFetchDecks();
  const { groups } = useFetchGroups();
  const { justQuizzes } = useFetchQuizzes();
  const navigate = useNavigate();

  const filteredCardsData = useMemo(() => {
    const combinedData = [...justQuizzes, ...decks, ...groups];

    return filterDeckCards(combinedData, filterValue);
  }, [justQuizzes, decks, groups, filterValue]);
  const constructedLink = (
    card: DeckSchema | QuizSchema | GroupSchema
  ): string => {
    if (card.type === "Deck") {
      return `/deck/${card.id}`;
    }
    if (card.type === "Quiz") {
      return `/quiz/${card.id}`;
    }
    if (card.type === "Group") {
      return `/group/${card.id}`;
    }
    return "";
  };

  const [profileIndex, setProfileIndex] = useState(0);
  const isProfileCard = (card: CardData): card is { isProfile: true } => {
    return "isProfile" in card;
  };
  const { width } = useWindowResize();
  useEffect(() => {
    if (width >= 640) {
      setProfileIndex(2);
    }
    if (width >= 768) {
      setProfileIndex(1);
    }
    if (width >= 1024) {
      setProfileIndex(2);
    }
    if (width >= 1280) {
      setProfileIndex(2);
    }
    if (width >= 1536) {
      setProfileIndex(3);
    }
  }, [width]);
  const orderedData: CardData[] = [...filteredCardsData];
  orderedData.splice(profileIndex, 0, { isProfile: true });
  return (
    <div
      id='dashboard-cards'
      className=' dashboard-cards grid items-stretch gap-x-[20px] gap-y-[30px] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
      {orderedData.map((card: CardData) => {
        if (isProfileCard(card)) {
          return (
            <div key='profile' className='hidden md:block'>
              <div className='flex size-full items-center justify-center '>
                <CardProfile />
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={`${card.type}${card.id}`}
              className='flex size-full items-center justify-center'>
              <div
                className='size-full'
                onClick={() => {
                  navigate(constructedLink(card));
                }}>
                <CardDefault data={card} />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export { DashboardCardContainer };
