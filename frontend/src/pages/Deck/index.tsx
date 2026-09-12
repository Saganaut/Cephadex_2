import { PageHeader } from "@common/PageHeader";
import { Loading } from "@source/common/InfoComponents/Loading";
import { NotFoundComponent } from "@source/common/InfoComponents/NotFoundComponent/NotFoundComponent";
import { ChatbotModal } from "@source/common/Modals/ChatbotModal";
import { ChatbotToggle } from "@source/common/Modals/ChatbotModal/ChatbotToggle";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import { useIntroJS } from "@source/lib/hooks/introJS/useIntroJS";
import { fetchOneDeck } from "@store/decks/actions";
import { selectDeckById } from "@store/decks/decksSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { Steps } from "intro.js-react";
import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MemoizedCardContainer } from "./CardContainer";
import { EditDeckModal } from "./components/EditDeckModal";
import { introSteps } from "./data/introSteps";
import { SideContainer } from "./SideContainer";
import { CollapseButton } from "./SideContainer/CollapseButton";

// const MINUTE_TO_REFRESH_DECK = 10;

const DeckPage = (): ReactElement => {
  const navigate = useNavigate();
  const { deckId } = useParams();
  const dispatch = useAppDispatch();
  const {
    deckEditModalIsOpen,
    setDeckEditModalIsOpen,
    setIsShareDeckModalOpen,
  } = useDeckContexts();
  const loadedDecks = useAppSelector((state) => state.decks.decksLoaded);
  const [isCollapsed, setIsCollapsed] = useState(true);
  //TODO: why do we have 10 here?
  const deck = useAppSelector((state) =>
    selectDeckById(state, parseInt(deckId ?? "", 10))
  );
  const [openChatModal, setOpenChatModal] = useState(false);
  const { stepsRef, isInitialTourActive, markSectionAsToured } = useIntroJS({
    type: "cards",
    introSteps,
    startingElement: "#deck-page",
  });

  const handleEdit = useCallback(() => {
    setDeckEditModalIsOpen(true);
  }, [setDeckEditModalIsOpen]);

  const handleShare = useCallback(() => {
    setIsShareDeckModalOpen(true);
  }, [setIsShareDeckModalOpen]);

  const handleStudy = useCallback(() => {
    navigate(`/study/deck/${deckId}`);
  }, [deckId, navigate]);
  const pageInfo = useMemo(
    () => ({
      subject: deck?.subject ?? "No Subject",
      topic: deck?.topic ?? "No Topic",
      cardsQuantity: deck?.qtyCards ?? 0,
      filesQuantity: deck?.qtyFiles ?? 0,
      quizzesQuantity: deck?.qtyQuizzes ?? 0,
    }),
    [
      deck?.subject,
      deck?.topic,
      deck?.qtyCards,
      deck?.qtyFiles,
      deck?.qtyQuizzes,
    ]
  );
  useEffect(() => {
    if (deckId !== undefined) {
      if (!loadedDecks.includes(Number(deckId))) {
        void dispatch(fetchOneDeck(Number(deckId)));
      }
    }
  }, [deckId, dispatch, loadedDecks]);
  if (deckId === undefined) {
    return (
      <NotFoundComponent
        title='404 - Deck not found'
        message="For some reason we couldn't find this deck.  Try refreshing the page."
      />
    );
  }
  if (deck == null) {
    return (
      <div
        className={
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        }>
        <Loading />{" "}
      </div>
    );
  }

  return (
    /// ! No page wrapper on this page due to the blur effect on the side
    <div
      id='deck-page'
      className={"relative w-full overflow-x-hidden pb-[120px]"}>
      {/* <div className="sm:hidden bg-mariana-blue rounded-t-xl border-t-2 border-t-white/40 fixed z-50 bottom-0 w-full h-24">
        Footer
      </div> */}
      {/* blur */}
      <div className='gradient-blur hidden sm:block'>
        <div></div>
      </div>
      <div
        className={
          "relative w-full rounded-[18px] pt-[120px] sm:px-[16px] lg:px-[64px]"
        }>
        <PageHeaderMemo
          title={deck.name}
          subtitle={deck.description}
          description={""}
          img={deck.img}
          onEdit={handleEdit}
          onShare={handleShare}
          type='withImage'
          info={pageInfo}
          onStudy={handleStudy}
        />
      </div>
      <div className='relative flex'>
        <div
          id='card-container'
          data-scroll-to='tooltip'
          className={`
          ${
            ""
            // isCollapsed ? "lg:pr-0" : "lg:pr-[200px]"""
          } 
           relative z-20  max-w-full grow transition-all duration-500 sm:px-[16px] md:max-w-[96%] lg:pl-[64px]`}>
          {/* TODO: why was this removed? */}
          <MemoizedCardContainer
            deckId={Number(deckId)}
            // onCardClick={handleCardClick}
          />
        </div>
        <div id='side-container' className={" absolute right-0 z-[21]"}>
          <div className=' flex justify-end p-2 pb-5'>
            <CollapseButton
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </div>
          <div className={`h-full w-0`}>
            <SideContainer
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              deck={deck}
            />
          </div>
        </div>
      </div>
      <EditDeckModal
        deck={deck}
        isOpen={deckEditModalIsOpen}
        setIsOpen={setDeckEditModalIsOpen}
      />
      <ChatbotToggleMemo setOpenChatModal={setOpenChatModal} />
      <ChatbotModal
        cardId={undefined}
        isOpen={openChatModal}
        setIsOpen={setOpenChatModal}
        page='deck'
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
    </div>
  );
};

export default DeckPage;

const PageHeaderMemo = React.memo(PageHeader, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.description === nextProps.description &&
    prevProps.img === nextProps.img &&
    prevProps.type === nextProps.type &&
    prevProps.info === nextProps.info &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onShare === nextProps.onShare
  );
});

const ChatbotToggleMemo = React.memo(ChatbotToggle, (prevProps, nextProps) => {
  return prevProps.setOpenChatModal === nextProps.setOpenChatModal;
});
