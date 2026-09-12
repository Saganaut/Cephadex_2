/**  Study deck page content
 *
 *  **/

import "swiper/css";

import { ChatbotModal } from "@common/Modals/ChatbotModal";
import { EditCardContentModal } from "@common/Modals/EditCardContentModal";
import { SwitchField } from "@source/common/Form/SwitchField";
import { NotFoundComponent } from "@source/common/InfoComponents/NotFoundComponent/NotFoundComponent";
import { ChatbotToggle } from "@source/common/Modals/ChatbotModal/ChatbotToggle";
import { DeleteCardModal } from "@source/common/Modals/DeleteConfirmationModal/DeleteCardModal";
import { SpeakingCeph } from "@source/common/SpeakingCeph";
import { useIntroJS } from "@source/lib/hooks/introJS/useIntroJS";
import { selectDeckById } from "@store/decks/decksSlice";
import { useAppSelector } from "@store/hooks";
import { CardFront } from "@study/components/DeckToStudy/CardFront";
import { NavigationControls } from "@study/components/DeckToStudy/ControlButtons/NavigationControls";
import Flashcard from "@study/components/DeckToStudy/Flashcard";
import useStudy from "@study/hooks/useStudy";
import { Steps } from "intro.js-react";
import React, { useRef, useState } from "react";
import { Keyboard, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

import { StudyInfo } from "./components/StudyInfo";
import { CTAButtons } from "./CTAButtons";
import { introSteps } from "./data/introSteps";

interface DeckToStudyContentProps {
  deckId: string;
}

const DeckToStudyContent: React.FC<DeckToStudyContentProps> = ({ deckId }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openChatModal, setOpenChatModal] = useState(false);
  const setSwiperRef = (ref: SwiperType): void => {
    swiperRef.current = ref;
  };
  const [casualMode, enableCasualMode] = useState(false);

  const { stepsRef, isInitialTourActive, markSectionAsToured } = useIntroJS({
    type: "study",
    introSteps,
  });

  const {
    onSlideChange,
    correctPercent,
    activeCard,
    handleRemoveOneCardFromHistory,
    cards,
    isLoading,
    currentDeckAnswers,
    cardsHistory,
    leftToStudy,
    skippedCards,
    noMoreCards,
  } = useStudy({
    deckId: deckId ?? "",
    casualMode,
    swiperRef,
  });

  const deck = useAppSelector((state) =>
    selectDeckById(state, parseInt(deckId, 10))
  );

  if (deckId === undefined) {
    return (
      <NotFoundComponent
        title={"DeckId not found"}
        message={"Please try reloading the page or contact us for support"}
      />
    );
  }

  return (
    <>
      <div
        id='study-deck-header'
        className={
          " flex w-full flex-wrap items-center justify-between gap-x-[15px]  bg-electric-violet-200 p-2 text-tolopea dark:bg-mariana-blue dark:text-white md:rounded-[10px] md:px-[12px] lg:justify-normal lg:rounded-full lg:bg-transparent"
        }>
        <h2 className={"text-[16px] font-bold md:text-[22px]"}>
          {deck?.name ?? "Study session"}
        </h2>
        <div className='flex items-center gap-2'>
          <label>{casualMode ? "Casual" : "Serious"}</label>
          <SwitchField
            enabled={casualMode}
            setEnabled={enableCasualMode}></SwitchField>
        </div>
        <StudyInfo
          currentDeckAnswers={currentDeckAnswers}
          correctPercent={correctPercent}
          skippedCards={skippedCards}
          leftToStudy={leftToStudy}
        />
      </div>
      <div
        className={
          "mt-2 flex h-[75vh] w-full gap-x-[15px] bg-mariana-blue-100  dark:bg-mariana-blue  md:mt-8 md:rounded-[18px] md:p-[15px] lg:h-[550px]"
        }>
        {/* The History */}
        <CardFront
          activeIndex={swiperRef.current?.activeIndex ?? 0}
          cardsHistory={cardsHistory}
          swiperRef={swiperRef}
        />
        {/* BACK OF THE CARD */}
        <div
          id='study-card-display'
          className={
            "relative flex size-full flex-col    bg-white px-2 py-[14px] dark:bg-tolopea md:rounded-[18px] md:px-[20px] lg:w-4/5"
          }>
          <CTAButtons
            editModal={isOpen}
            setEditModal={setIsOpen}
            deleteModal={isDeleteOpen}
            setDeleteModal={setIsDeleteOpen}
            itemId={activeCard?.id}
            isFavorite={activeCard?.fav}
          />
          {/* CARD CONTENT */}
          <Swiper
            tabIndex={-1}
            onInit={(swiper) => {
              setSwiperRef(swiper);
            }}
            keyboard={{
              enabled: true,
            }}
            virtual={{
              enabled: true,
              addSlidesBefore: 1,
              addSlidesAfter: 1,
            }}
            fadeEffect={{
              crossFade: true,
            }}
            className={" size-full lg:h-[450px]"}
            spaceBetween={0}
            modules={[Keyboard, Virtual]}
            slidesPerView={1}
            onSlideChange={onSlideChange}>
            {cards.map((card) => (
              <SwiperSlide
                tabIndex={-1}
                key={card.uniqueId}
                className={"size-full  lg:px-[15px] xl:px-[35px]"}>
                {({ isNext, isPrev }) => (
                  <div
                    tabIndex={-1}
                    className={"flex size-full items-center justify-center"}>
                    <Flashcard
                      activeCard={activeCard}
                      deckId={deckId}
                      isLoading={isLoading}
                      isPrev={isPrev || isNext}
                      card={card}
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
            {(noMoreCards || leftToStudy === 0) && (
              <SwiperSlide
                tabIndex={-1}
                key={"1X2"}
                className={"size-full lg:px-[35px]"}>
                <div
                  tabIndex={-1}
                  className={
                    "flex size-full flex-col items-center justify-center text-2xl font-bold text-white"
                  }>
                  <SpeakingCeph text="Great work!  You're done studying this deck for now, come back later" />
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          {/* TODO: These navigation controls should be refafactored to be with the control buttons */}

          <NavigationControls
            currentIndex={
              swiperRef.current != null
                ? swiperRef?.current?.activeIndex + 1
                : 0
            }
            swiperRef={swiperRef?.current}
            totalCards={cards.length ?? 0}
          />
        </div>
        <EditCardContentModal
          deckId={deckId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          type={"Study"}
          activeCard={activeCard}
        />

        <DeleteCardModal
          type={"Study"}
          handleDeleteCardFromHistory={handleRemoveOneCardFromHistory}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          activeCard={activeCard}
          deckId={deckId}
        />
      </div>
      <ChatbotToggle setOpenChatModal={setOpenChatModal} />
      <ChatbotModal
        cardId={activeCard?.id}
        isOpen={openChatModal}
        setIsOpen={setOpenChatModal}
        page='study'
      />
      <Steps
        ref={stepsRef}
        enabled={isInitialTourActive}
        steps={introSteps}
        initialStep={0}
        options={{
          overlayOpacity: 0.8,
          showProgress: true,
          hidePrev: true,
          hideNext: false,
          isActive: isInitialTourActive,
          showStepNumbers: false,
          showBullets: false,
          keyboardNavigation: false,
          dontShowAgain: false,
          dontShowAgainLabel: "Don't show again",
          helperElementPadding: 10,
          disableInteraction: false,
          scrollToElement: false,
        }}
        onExit={() => {
          markSectionAsToured();
        }}
      />
    </>
  );
};

export { DeckToStudyContent };
