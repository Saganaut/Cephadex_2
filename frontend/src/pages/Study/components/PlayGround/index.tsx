// Import Swiper styles
import "swiper/css";

import { type Card } from "@customTypes/Deck";
import { FlashCard } from "@deck/components/FlashCard";
import { fetchDeckCardsThunk } from "@services/Api/Deck/CardApiThunks";
import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";

const Playground = (): ReactElement => {
  const decks = useAppSelector((state) => state.decks);
  const dispatch = useAppDispatch();
  const deckCards = useAppSelector((state) => state.deckCards);
  const [selectedDeckId, setSelectedDeckId] = useState(0);
  const [activeCard, setActiveCard] = useState<Card>();
  const [show, setShow] = useState(false);
  useEffect(() => {
    void dispatch(fetchDecksThunk());
    void dispatch(fetchDeckCardsThunk(selectedDeckId));
  }, [dispatch, selectedDeckId]);
  const swiperRef = useRef<SwiperType | null>(null);
  useEffect(() => {
    setActiveCard(deckCards?.deckCards?.cards[0]);
  }, [deckCards]);

  const setSwiperRef = (ref: SwiperType): void => {
    swiperRef.current = ref;
  };

  return (
    <div className="bg-tolopea text-white">
      <h1 className="my-10 text-2xl">Select A deck</h1>

      {decks.decks.map((deck) => (
        <div
          key={deck.id}
          onClick={() => {
            setSelectedDeckId(deck.id);
          }}
        >
          {deck.name}
        </div>
      ))}

      {/*  CARDS WILL SHOW HERE */}

      <div className={"mb-20 mt-8 max-h-min w-full border-2 border-white"}>
        <Swiper
          onInit={(swiper) => {
            setSwiperRef(swiper);
          }}
          className={"h-[600px] w-full"}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(e) => {
            setShow(false);
            setActiveCard(deckCards?.deckCards?.cards[e.activeIndex]);
          }}
        >
          {deckCards?.deckCards?.cards.map((card, index) => (
            <SwiperSlide key={index} className={"w-full"}>
              {({ isActive }) => (
                <div className={"flex w-full items-center justify-center"}>
                  <FlashCard card={card} isActive={isActive} show={show} />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {activeCard?.category === "Definitions" && (
          <div
            className={
              "m-2 flex items-center justify-between border-2 border-white p-2 "
            }
          >
            <button
              onClick={() => {
                incrementCardFunction(activeCard);
              }}
            >
              Lost it
            </button>
            <button
              onClick={() => {
                setShow(!show);
              }}
            >
              Show
            </button>
            <button
              onClick={() => {
                setShow(!show);
                decrementCardFunction(activeCard);
              }}
            >
              Got it
            </button>
          </div>
        )}
        <div
          className={
            "m-2 flex items-center justify-between border-2 border-white p-2 "
          }
        >
          <button
            onClick={() => {
              swiperRef?.current?.slidePrev();
            }}
          >
            Prev
          </button>
          <h1>{activeCard?.id}</h1>
          <button
            onClick={() => {
              swiperRef?.current?.slideNext();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export { Playground };
// Returns The New Card Data after it has been incremented
export const incrementCardFunction = (card: Card): Card => {
  const updatedCard = Object.assign({}, card);

  updatedCard["times-correct"] += 1;
  updatedCard["times-asked"] += 1;
  updatedCard["times-correct_row"] += 1;

  if (updatedCard["times-correct_row"] > 2) {
    updatedCard["box-id"] += 1;
    updatedCard["box-id"] = Math.min(updatedCard["box-id"], 3);
  }
  if (updatedCard["box-id"] === 0) {
    updatedCard["srs-interval"] *= 2;
  }

  if (updatedCard["box-id"] === 1) {
    updatedCard["srs-interval"] *= 4;
  }
  if (updatedCard["box-id"] === 2) {
    updatedCard["srs-interval"] *= 6;
  }
  if (updatedCard["box-id"] === 3) {
    updatedCard["srs-interval"] *= 10;
  }
  updatedCard["srs-interval"] = Math.min(updatedCard["srs-interval"], 525600);

  if (updatedCard["times-correct_row"] > 3) {
    updatedCard["srs-interval"] += 1440;
  }

  updatedCard["time-updated"] = new Date().toISOString().slice(0, 19);

  return updatedCard;
};

// Returns The New Card Data after it has been decremented
export const decrementCardFunction = (card: Card): Card => {
  const updatedCard = Object.assign({}, card);

  updatedCard["times-asked"] += 1;
  updatedCard["times-correct_row"] = 0;
  if (updatedCard["box-id"] === 1) {
    updatedCard["srs-interval"] *= 0.5;
  }
  if (updatedCard["box-id"] === 2) {
    updatedCard["srs-interval"] *= 0.8;
  }
  if (updatedCard["box-id"] === 3) {
    updatedCard["srs-interval"] *= 0.9;
  }

  if (updatedCard["box-id"] !== 1 && updatedCard["srs-interval"] < 5) {
    updatedCard["srs-interval"] = 5;
  }

  if (updatedCard["box-id"] > 0) {
    updatedCard["box-id"] -= 1;
  }

  updatedCard["time-updated"] = new Date().toISOString().slice(0, 19);

  return updatedCard;
};
