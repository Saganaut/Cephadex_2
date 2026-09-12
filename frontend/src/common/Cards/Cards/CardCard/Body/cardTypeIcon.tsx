import ClozeCardIcon from "@assets/cardTypeIcons/ClozeCardIcon.svg?react";
import CustomCardIcon from "@assets/cardTypeIcons/CustomCardIcon.svg?react";
import DefintionCardIcon from "@assets/cardTypeIcons/DefinitionCardIcon.svg?react";
import McqCardIcon from "@assets/cardTypeIcons/McqCardIcon.svg?react";
import TranslationCardIcon from "@assets/cardTypeIcons/TranslationCardIcon.svg?react";
import DeckIcon from "@assets/DeckIcon.svg?react";
import React, { type ReactElement } from "react";

const cardTypeIcon = (
  img: string | null | undefined,
  type: string | undefined
): ReactElement => {
  const typeLower = type != null ? type.toLowerCase() : "";
  const iconClass = "h-[46px] w-[46px]";
  if (img != null) {
    return <DeckIcon />;
  }
  if (typeLower === "mcq") {
    return <McqCardIcon className={iconClass} />;
  }
  if (typeLower === "cloze") {
    return <ClozeCardIcon className={iconClass} />;
  }
  if (typeLower === "definitions") {
    return <DefintionCardIcon className={iconClass} />;
  }
  if (typeLower === "translation") {
    return <TranslationCardIcon className={iconClass} />;
  }
  if (typeLower === "custom") {
    return <CustomCardIcon className={iconClass} />;
  }
  return <DeckIcon />;
};

export { cardTypeIcon };
