import StudyIcon from "@assets/StudyIcon.svg";
import { PageHeader } from "@common/PageHeader";
import { PageWrapper } from "@common/PageWrapper";
import { SelectADeck } from "@common/SelectADeck";
import type { DeckSchema } from "@source/client";
import { FileModal } from "@source/common/Modals/FileModal";
import React, { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

export default function Study(): ReactElement {
  const navigate = useNavigate();

  const handleDeckClick = (deck: DeckSchema): void => {
    navigate(`/study/deck/${deck.id}`);
  };
  return (
    <PageWrapper>
      <div className={"relative w-full rounded-[18px]"}>
        <PageHeader
          title={"Study your decks"}
          subtitle={""}
          description={"Dive in to your personalized sea of knowledge"}
          hideCategories={true}
          type='withImage'
          img={StudyIcon}
        />
        <SelectADeck onDeckClick={handleDeckClick} />
      </div>
      <FileModal />
    </PageWrapper>
  );
}
