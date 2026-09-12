/**  Study deck page
 * Entry point for the deck to study page, only function is to grab deckId

*  **/

import "swiper/css";

import { PageWrapper } from "@common/PageWrapper";
import { NotFoundComponent } from "@source/common/InfoComponents/NotFoundComponent/NotFoundComponent";
import React, { type ReactElement } from "react";
import { useParams } from "react-router-dom";

import { DeckToStudyContent } from "./DeckToStudyContent";

export default function DeckToStudy(): ReactElement {
  const { deckId } = useParams();

  if (deckId === undefined) {
    return (
      <NotFoundComponent
        title={"DeckId not found"}
        message={"Please try reloading the page or contact us for support"}
      />
    );
  }

  return (
    <PageWrapper className={"flex flex-col justify-start"}>
      <DeckToStudyContent deckId={deckId} />
    </PageWrapper>
  );
}
