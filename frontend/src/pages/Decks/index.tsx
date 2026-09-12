import DeckIcon from "@assets/DeckIcon.svg";
import { PageHeader } from "@common/PageHeader";
import { PageWrapper } from "@common/PageWrapper";
import { SelectADeck } from "@common/SelectADeck";
import { type DeckSchema } from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { useIntroJS } from "@source/lib/hooks/introJS/useIntroJS";
import { Steps } from "intro.js-react";
import React, { type ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

import { introSteps } from "./data/introSteps";

const Decks = (): ReactElement => {
  const navigate = useNavigate();
  const handleDeckClick = (deck: DeckSchema): void => {
    navigate(`/deck/${deck.id}`);
  };
  const { stepsRef, isInitialTourActive, markSectionAsToured } = useIntroJS({
    type: "decks",
    introSteps,
  });
  const [deckLength, setDeckLength] = useState(0);
  const Details = (): ReactElement => {
    return (
      <div className={"mt-[32px] flex items-center gap-x-[12px]"}>
        <h1 className={"text-lg font-medium"}>
          Explore your {deckLength} decks Or
        </h1>
        <Button
          label={"Create a Deck"}
          onClick={() => {
            navigate("/create-deck");
          }}
        />
      </div>
    );
  };
  return (
    <PageWrapper>
      <PageHeader
        title={"My Decks"}
        subtitle={"You treasure trove of knowledge."}
        CustomDetails={Details}
        description={""}
        type="withImage"
        img={DeckIcon}
      />
      <div className="">
        <SelectADeck
          setDeckLength={setDeckLength}
          onDeckClick={handleDeckClick}
        />
      </div>

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
    </PageWrapper>
  );
};

export default Decks;
