// Import Swiper styles
import "swiper/css";

import { type Card } from "@customTypes/Deck";
import { useSaveBatch } from "@hooks/useSaveBatch";
import { fetchDeckCardsThunk } from "@services/Api/Deck/CardApiThunks";
import {
  decrementCardFunction,
  incrementCardFunction,
} from "@source/lib/utils/functions";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { CardFront } from "@study/components/DeckToStudy/CardFront";
import { ControlButtons } from "@study/components/DeckToStudy/ControlButtons";
import { Flashcard } from "@study/components/DeckToStudy/Flashcard";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";

const DeckToStudy = (): ReactElement => {
  const { deckId } = useParams();
  const handlePushData = useSaveBatch();
  const dispatch = useAppDispatch();
  const deckCards = useAppSelector((state) => state.deckCards);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [currentCardState, setCurrentCardState] = useState<boolean | null>(
    null
  );
  const [currentCardShow, setCurrentCardShow] = useState(false);
  const [cardsHistory, setCardsHistory] = useState<Card[]>([]);

  const swiperRef = useRef<SwiperType | null>(null);
  const setSwiperRef = (ref: SwiperType): void => {
    swiperRef.current = ref;
  };

  // Add Cards to the history Array && Sets Initial Active Card
  useEffect(() => {
    if (deckCards?.deckCards?.cards == null) return;
    setActiveCard(deckCards.deckCards.cards[0]);
    if (activeCard == null) return;
    addToHistory(activeCard);
  }, [deckCards]);

  // Fetch Cards based on Deck ID
  useEffect(() => {
    if (deckId == null) return;
    void dispatch(fetchDeckCardsThunk(parseInt(deckId)));
  }, [dispatch, deckId]);

  const addToHistory = (card: Card): void => {
    // Check if card is already in the cardsHistory array
    const cardExists = cardsHistory.find((c) => c.id === card.id);
    if (cardExists != null) return;
    setCardsHistory((prev) => [...prev, card]);
  };

  const handleMQCCardUpdate = (
    answer: string | null,
    setAnswer: React.Dispatch<React.SetStateAction<string | null>>
  ): void => {
    if (activeCard == null) return;
    setAnswer(answer);
    const isCorrect = answer === activeCard?.content;
    setCurrentCardState(isCorrect);
    if (isCorrect) {
      handlePushData(incrementCardFunction(activeCard));
    }
    if (!isCorrect) {
      handlePushData(decrementCardFunction(activeCard));
    }
  };

  const handleDefinitionCardUpdate = (gotIt: boolean): void => {
    if (activeCard == null) return;
    if (gotIt) {
      setCurrentCardState(true);
      handlePushData(incrementCardFunction(activeCard));
    }
    if (!gotIt) {
      setCurrentCardState(false);
      handlePushData(decrementCardFunction(activeCard));
    }
  };

  return (
    <div className="bg-tolopea text-white">
      {/*  CARDS WILL SHOW HERE */}

      <div className={"flex items-center gap-x-[15px]"}>
        <h1 className={"text-[22px] font-bold"}>Deck Name</h1>
        <div
          className={
            "flex items-center gap-x-[20px] rounded-full bg-mariana-blue p-2 px-6"
          }
        >
          <p>Answer | 0</p>
          <p>Correct | 0%</p>
          <p>Left to study | 3</p>
        </div>
      </div>

      <div
        className={
          "mt-8 flex h-[550px] w-full gap-x-[15px] rounded-[18px] bg-mariana-blue p-[15px]"
        }
      >
        <CardFront
          activeCard={activeCard}
          cardsHistory={cardsHistory}
          swiperRef={swiperRef}
        />
        {/* BACK OF THE CARD */}
        <div
          className={
            "relative flex h-full w-[80%] flex-col justify-between rounded-[18px] bg-tolopea px-[20px] py-[14px]"
          }
        >
          {/* CTA ICONS */}
          <div className={"flex items-center justify-end gap-x-[20px]"}>
            <div
              className={"h-[35px] w-[35px] rounded-full bg-electric-violet"}
            />
            <div
              className={"h-[35px] w-[35px] rounded-full bg-electric-violet"}
            />
            <div
              className={"h-[35px] w-[35px] rounded-full bg-electric-violet"}
            />
            <div
              className={"h-[35px] w-[35px] rounded-full bg-electric-violet"}
            />
          </div>

          {/* CARD CONTENT */}
          <Swiper
            onInit={(swiper) => {
              setSwiperRef(swiper);
            }}
            className={"h-[380px] w-full"}
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={(e) => {
              setCurrentCardState(null);
              addToHistory(deckCards?.deckCards?.cards[e.activeIndex]);
              setActiveCard(deckCards?.deckCards?.cards[e.activeIndex]);
            }}
          >
            {deckCards?.deckCards?.cards.map((card, index) => (
              <SwiperSlide key={index} className={"h-full w-full px-[35px]"}>
                {({ isActive, isNext, isPrev, isVisible }) => (
                  <div
                    className={"flex h-full w-full items-center justify-center"}
                  >
                    <Flashcard
                      card={card}
                      isActive={isActive}
                      setGlobalShow={setCurrentCardShow}
                      handleMQCCardUpdate={handleMQCCardUpdate}
                      handleDefinitionCardUpdate={handleDefinitionCardUpdate}
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          <ControlButtons
            activeCard={activeCard}
            currentCardShow={currentCardShow}
            currentCardState={currentCardState}
            swiperRef={swiperRef}
            handleDefinitionCardUpdate={handleDefinitionCardUpdate}
            deckCards={deckCards}
          />
        </div>
      </div>
    </div>
  );
};

export { DeckToStudy };

// {/* <Swiper */}
//         {/*   onInit={(swiper) => { */}
//         {/*     setSwiperRef(swiper); */}
//         {/*   }} */}
//         {/*   className={"h-[600px] w-full"} */}
//         {/*   spaceBetween={0} */}
//         {/*   slidesPerView={1} */}
//         {/*   onSlideChange={(e) => { */}
//         {/*     setShow(false); */}
//         {/*     setActiveCard(deckCards?.deckCards?.cards[e.activeIndex]); */}
//         {/*   }} */}
//         {/* > */}
//         {/*   {deckCards?.deckCards?.cards.map((card, index) => ( */}
//         {/*     <SwiperSlide key={index} className={"w-full"}> */}
//         {/*       {({ isActive }) => ( */}
//         {/*         <div className={"flex w-full items-center justify-center"}> */}
//         {/*           <FlashCard card={card} isActive={isActive} show={show} /> */}
//         {/*         </div> */}
//         {/*       )} */}
//         {/*     </SwiperSlide> */}
//         {/*   ))} */}
//         {/* </Swiper> */}
