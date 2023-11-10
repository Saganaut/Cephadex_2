// Import Swiper styles
import "swiper/css";

import { type Card } from "@customTypes/Deck";
import { FlashCard } from "@deck/FlashCard";
import { fetchDeckCardsThunk } from "@services/Api/Deck/CardApiThunks";
import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";
import { axiosPrivate } from "@services/axios";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";

export const decrementCard = async (cardId: number): Promise<void> => {
  try {
    const res = await axiosPrivate.post(
      `/study_bp/api_0/study/card/increment/${cardId}`
    );

    if (res.status === 200) {
      console.log("OK!, decremented Card");
    } else console.log("ERROR!, could not decrement Card");
  } catch (error) {
    console.log(error);
  }
};

export const incrementCard = async (cardId: number): Promise<void> => {
  try {
    const res = await axiosPrivate.post(
      `/study_bp/api_0/study/card/increment/${cardId}`
    );

    if (res.status === 200) {
      console.log("OK!, incremented Card");
    } else console.log("ERROR!, could not increment Card");
  } catch (error) {
    console.log(error);
  }
};

const Playground = (): ReactElement => {
  const decks = useAppSelector((state) => state.decks);
  const dispatch = useAppDispatch();
  const deckCards = useAppSelector((state) => state.deckCards);
  const [selectedDeckId, setSelectedDeckId] = useState(0);
  const [activeCard, setActiveCard] = useState<Card>();

  useEffect(() => {
    void dispatch(fetchDecksThunk());
    void dispatch(fetchDeckCardsThunk(selectedDeckId));
  }, [dispatch, selectedDeckId]);
  const swiperRef = useRef<SwiperType | null>(null);
  console.log(activeCard);
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
            setActiveCard(deckCards?.deckCards?.cards[e.activeIndex]);
          }}
        >
          {deckCards?.deckCards?.cards.map((card, index) => (
            <SwiperSlide key={index} className={"w-full"}>
              <div className={"flex w-full items-center justify-center"}>
                <FlashCard card={card} />
              </div>
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
              onClick={async () => {
                await incrementCard(activeCard?.id);
              }}
            >
              Lost it
            </button>
            <button>Show</button>
            <button
              onClick={async () => {
                await decrementCard(activeCard?.id);
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
          {/* {activeCard != null && <h1>{activeCard.id}</h1>} */}
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
