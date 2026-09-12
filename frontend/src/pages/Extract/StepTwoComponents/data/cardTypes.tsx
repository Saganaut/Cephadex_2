// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite-plugin-svgr/client" />
import CardTypeTranslate from "@assets/assets/cardTypeIcons/CardTypeTranslate.svg?react";
import CardTypeCloze from "@assets/cardTypeIcons/CardTypeCloze.svg?react";
import CardTypeCustom from "@assets/cardTypeIcons/CardTypeCustom.svg?react";
import CardTypeDef from "@assets/cardTypeIcons/CardTypeDef.svg?react";
import CardTypeDefinitions from "@assets/cardTypeIcons/CardTypeDefinitions.svg?react";
import CardTypeMcq from "@assets/cardTypeIcons/CardTypeMcq.svg?react";

const cardTypes = [
  {
    label: "Mix",
    value: "Mix",
    description: "A mix of multiple choice questions and definitions",
    icon: CardTypeDefinitions,
  },
  {
    label: "Definitions",
    value: "Definitions",
    description: "Terms and their definitions",

    icon: CardTypeDef,
  },
  {
    label: "Fill in the blanks",
    value: "Fill in the blanks",
    description: "Fill in the blank sentences and their answers",

    icon: CardTypeCloze,
  },
  {
    label: "Multiple choice",
    value: "Multiple choice",
    description: "A question with 3 wrong answers and 1 correct one",

    icon: CardTypeMcq,
  },
  {
    label: "Translate",
    value: "Translate",
    description: "Terms and their translation to your chosen language",

    icon: CardTypeTranslate,
  },
  {
    label: "Custom",
    value: "Custom",
    description: "Create 100% custom cards",
    icon: CardTypeCustom,
  },

  // {
  //   label: "Formulas",
  //   value: "Formulas",
  //   description: "Extracts scientific formulas, their names and explanations",
  //   icon: null,
  // },

  // {
  //   label: "Theories",
  //   value: "Theories",
  //   description: "Major theories and explanations",
  //   icon: null,
  // },
  // {
  //   label: "Rhyme",
  //   value: "Rhyme",
  //   description: "Short poems created from your content",
  //   icon: null,
  // },
  // {
  //   label: "Explain",
  //   value: "Explain",
  //   description: "Questions that require you to practice your explanations",
  //   icon: null,
  // },
  // {
  //   label: "Discuss",
  //   value: "Discuss",
  //   description: "Discussion topics with different sides of the debate",
  //   icon: null,
  // },
  // {
  //   label: "Transcribe",
  //   value: "Transcribe",
  //   description: "Transcribe to a language of your choice",
  //   icon: null,
  // },
];

type CardType =
  | "Mix"
  | "Definitions"
  | "Fill in the blanks"
  | "Multiple choice"
  | "Translate"
  | "Formulas"
  | "Theories"
  | "Rhyme"
  | "Vocabulary builder"
  | "Explain"
  | "Discuss"
  | "Transcribe"
  | "Summarize"
  | "Turn to notes "
  | "Custom";

export { cardTypes };
