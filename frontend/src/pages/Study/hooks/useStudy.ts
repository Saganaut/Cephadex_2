/* eslint-disable no-console */
/** This hook handles most of the study logic
 * There are two modes, regular and casual
 *
 * Regular Mode:
 * Uses spaced repetition
 * Only cards that are "due" are fetched
 * The results of all study selections are saved, passed to the server and used to calculate future "due" cards
 * In this case cardInstances does not represent unique cards!!
 * If a card is not known well, it can show up several times in cardInstances
 * As such cardInstances have a uniqueId - different from their card id
 *
 * Casual Mode:
 * We simply fetch cards as we would in decks
 * We do not remember the result of the study session
 * In this case cardInstances are just cards, and the uniqueId is just the same as the cardId
 * Since we are using the same API call as regular card fetching in decks we will use batchNumber in place
 * of the pageNumber pagination
 * TODO: Add in logic/state to track when reaching the end of the deck (pageNumber (or batchNumber) == totalPages)
 *
 *
 *  **/
import type { StudyCardSchema } from "@source/client";
import {
  resetCardInstancesSlice,
  selectAllCardInstances,
} from "@source/lib/store/cardInstances/cardInstancesSlice";
import type { IStudyContext } from "@source/types";
import {
  addAnswer,
  removeAllAnswers,
  resetAnswersSlice,
  selectAnswers,
} from "@store/answers/answersSlice";
import {
  fetchCards,
  fetchDueCards,
  fetchDueNextCards,
} from "@store/cardInstances/actions";
import {
  addCardToHistory,
  removeOneCardFromHistory,
  resetCardsHistorySlice,
  selectCardsHistory,
} from "@store/cardsHistory/cardsHistorySlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper/types";

interface IUseStudyLogic {
  deckId: string | null;
  casualMode: boolean;
  swiperRef: React.MutableRefObject<SwiperType | null>;
}
export default function useStudy({
  deckId,
  casualMode,
  swiperRef,
}: IUseStudyLogic): IStudyContext {
  //  ===================== REDUX =========================
  const dispatch = useAppDispatch();
  const answers = useAppSelector(selectAnswers);
  const cardsHistory = useAppSelector(selectCardsHistory);
  const cardsStatus = useAppSelector((state) => state.cardInstances.status);
  const cards = useAppSelector(selectAllCardInstances);
  const batchNumber = useAppSelector(
    (state) => state.cardInstances.batchNumber
  );
  const qtyCardsSeen = useAppSelector(
    (state) => state.cardInstances.qtyCardsSeen
  );
  // =============================  React State =======================
  const [activeCard, setActiveCard] = useState<StudyCardSchema | null>(null);
  const [noMoreCards, setNoMoreCards] = useState(false);

  //  REDUX Filtered Data
  const currentDeckAnswers = useMemo(
    () => answers.filter((a) => a.deckId === parseInt(deckId ?? "")),
    [answers, deckId]
  );

  // =============================  Initialization & Mode Change =======================
  /** Clear everything, gets reset on page load, if deckId changes (it shouldn't)
   * and if we toggle casualmode**/

  useEffect(() => {
    setNoMoreCards(false);
    setActiveCard(null);
    dispatch(resetCardInstancesSlice());
    dispatch(resetCardsHistorySlice());
    dispatch(resetAnswersSlice());
  }, [casualMode, deckId, dispatch]);

  /**  ============================ INITIAL FETCH ==============================
   * Should only take place on page load & if casual mode is toggled
   * loading state can come from cardInstancesSlice
   * if cardInstancesSlices status is idle, fetch card instances
   * If casualMode we use fetchCards, otehrwise use fetchDueCards
   * **/

  // SET ACTIVE CARD ONCE THE CARDS ARE LOADED & ADD THE FIRST CARD TO HISTORY
  // Adding cards to this useEffect is triggering tons of re-renders
  useEffect(() => {
    if (cardsStatus === "succeeded" && cardsHistory.length === 0) {
      if (cards == null || cards[0] == null) {
        // TODO: Here we should have an error message
        // Oops sorry we couldn't find any cards to study
        return;
      }
      setActiveCard(cards[0]);
      dispatch(addCardToHistory(cards[0]));
    }
  }, [cards, cardsStatus, dispatch, cardsHistory.length]);
  //Incrementing the batch number is causing a refetch, it seems with a timing issue in production
  // which leads to never ending loop

  useEffect(() => {
    if (cardsStatus !== "idle" || deckId == null) return;
    if (casualMode) {
      void dispatch(fetchCards({ deckId: parseInt(deckId), page: "1" }));
    } else {
      void dispatch(fetchDueCards(parseInt(deckId)));
    }
  }, [cardsStatus, casualMode, deckId, dispatch]);

  const currentDeckAnswersRef = useRef(currentDeckAnswers);
  currentDeckAnswersRef.current = currentDeckAnswers;

  /**  ============================ Fetching new batch ==============================
   * Should take place when we have cycled through all cards
   * If there are no more cards due in regular mode, setNoMoreCards to true
   * If we reach the end of the deck in casual mode just restart from the beginning
   *
   * How do we know when re reach the end of the deck?
   * -> if currentPage === totalPages --> don't refetch but instead reset then re-fetch
   * **/
  useEffect(() => {
    const fetchNewCards = async (): Promise<void> => {
      if (
        swiperRef.current?.activeIndex == null ||
        swiperRef.current?.activeIndex === 0
      )
        return;
      if (batchNumber == null) {
        return;
      }
      if (swiperRef.current?.activeIndex >= cards.length - 1) {
        if (casualMode) {
          if (deckId == null) {
            //TODO: Add error message here, though this should never happen
            return;
          }
          await dispatch(
            fetchCards({
              deckId: parseInt(deckId),
              page: batchNumber.toString(),
            })
          )
            .unwrap()
            .then((response) => {
              swiperRef?.current?.updateSlides();
              if (response.cards == null) {
                setNoMoreCards(true);
                return;
              }
              if (response.cards.length <= 0) {
                setNoMoreCards(true);
              }
            });
        } else {
          await dispatch(
            fetchDueNextCards({
              cards: currentDeckAnswersRef.current,
              deckId: parseInt(deckId ?? ""),
              batchNumber,
              settings: null,
            })
          )
            .unwrap()
            .then((response) => {
              swiperRef?.current?.updateSlides();
              if (response.cards.length <= 0) {
                setNoMoreCards(true);
              }
            })
            .catch((rejectedValueOrSerializedError) => {
              // handle error here
              //TODO: ADd error message here
            });
        }
      }
    };
    void fetchNewCards();
    // The exhaustive deps is throwing for swiperRef even though the full obj is included
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    batchNumber,
    cards.length,
    deckId,
    dispatch,
    noMoreCards,
    swiperRef.current?.activeIndex,
  ]);

  // HANDLE SKIPPED CARDS
  // Only matters for regular mode, will have no impact in casual mode
  const handleSkippedCards = useCallback(
    (uniqueId: number): void => {
      const card = cards.find((c) => c.uniqueId === uniqueId);
      const found = currentDeckAnswers.find(
        (a) => a.uniqueId === card?.uniqueId
      );
      // If we have a card, but no corresponding answer for that instance then mark as skipped
      if (card != null && found == null && card.deckId != null) {
        dispatch(
          addAnswer({
            deckId: card.deckId,
            cardId: card.id,
            action: "skip",
            uniqueId: card.uniqueId,
          })
        );
      }
    },
    [dispatch, cards, currentDeckAnswers]
  );
  /** HANDLE REMOVE ONE CARD FROM HISTORY
   *  This is only used when permanently deleting a card to ensure it is also deleted
   * from the study session
   *
   * **/
  const handleRemoveOneCardFromHistory = (): void => {
    if (cardsHistory == null) return;
    if (activeCard !== null) {
      dispatch(removeOneCardFromHistory(activeCard));
    }
    // If we are deleting the first card, then we go straight to the next one
    if (swiperRef.current?.activeIndex === 0) {
      if (cards[1] == null) {
        throw new Error("Card is undefined");
      }
      setActiveCard(cards[1]);
    }
    // Otherwise we go to to the previous card
    if (swiperRef.current?.activeIndex !== 0) {
      swiperRef.current?.slidePrev();
      if (swiperRef.current?.activeIndex != null) {
        const activeCard = cards[swiperRef.current.activeIndex];
        if (activeCard == null) {
          throw new Error("Can't swipe. Card is undefined");
        } else {
          setActiveCard(activeCard);
        }
      }
    }
  };

  const onSlideChange = useCallback(
    (e: SwiperType): void => {
      if (cardsStatus === "idle" || cardsStatus === "failed") return;
      const activeCard = cards[e.activeIndex];
      const previousCardUniqueId = cards[e.previousIndex]?.uniqueId;
      const card = activeCard?.uniqueId !== 0 ? activeCard : null;
      if (card != null) {
        dispatch(addCardToHistory(card));
      }
      if (previousCardUniqueId != null) {
        handleSkippedCards(previousCardUniqueId);
      }
      if (activeCard == null) {
        throw new Error("active card is undefined");
      }
      setActiveCard(activeCard);
    },
    [cards, dispatch, handleSkippedCards, cardsStatus]
  );

  // This used effect is to trigger when there are no more cards to fetch from the server
  // It will trigger the display of a message to come back later
  useEffect(() => {
    if (cards.length <= 0) {
      setNoMoreCards(true);
    } else {
      setNoMoreCards(false);
    }
  }, [cards.length]);

  /**=============================================== CALCULATIONS ===========================================**/
  // CALCULATE THE PERCENTAGE OF CORRECT ANSWERS
  // TODO: this calculation is redone every time, move to state?
  const correctPercent = useMemo(() => {
    function calculateCorrectPercentage(): number {
      if (deckId == null) return 0;
      let correct = 0;
      currentDeckAnswers?.forEach((a) => {
        if (a.action === "incr") {
          correct += 1;
        }
      });
      if (currentDeckAnswers?.length <= 0) return 0;
      const totalAnswers = answers.length;
      return (correct / totalAnswers) * 100;
    }
    return calculateCorrectPercentage();
  }, [answers, deckId, currentDeckAnswers]);

  // CALCULATE THE NUMBER OF CARDS LEFT TO STUDY
  const leftToStudy = useMemo(() => {
    return answers.length > 0 ? qtyCardsSeen - answers.length : qtyCardsSeen;
  }, [qtyCardsSeen, answers.length]);

  // CALCULATE THE NUMBER OF CARDS Skipped
  const skippedCards = useMemo(() => {
    return answers.filter((c) => c.action === "skip").length;
  }, [answers]);

  const isLoading = cardsStatus === "idle";
  // CLEAR THE DECK ANSWERS IF A USER LEAVES THE PAGE
  useEffect(() => {
    return () => {
      dispatch(removeAllAnswers());
    };
  }, [dispatch]);

  return {
    correctPercent,
    cardsHistory,
    activeCard,
    leftToStudy,
    setActiveCard,
    handleRemoveOneCardFromHistory,
    cards,
    cardsStatus,
    isLoading,
    currentDeckAnswers,
    onSlideChange,
    skippedCards,
    noMoreCards,
  } as const;
}
