import CardTypeCloze from "@source/assets/cardTypeIcons/CardTypeCloze.svg?react"; // eslint-disable-line
import CardTypeCustom from "@source/assets/cardTypeIcons/CardTypeCustom.svg?react"; // eslint-disable-line
import CardTypeDef from "@source/assets/cardTypeIcons/CardTypeDef.svg?react"; // eslint-disable-line
import CardTypeDefinitions from "@source/assets/cardTypeIcons/CardTypeDefinitions.svg?react"; // eslint-disable-line
import CardTypeMcq from "@source/assets/cardTypeIcons/CardTypeMcq.svg?react"; // eslint-disable-line
import CardTypeTranslate from "@source/assets/cardTypeIcons/CardTypeTranslate.svg?react"; // eslint-disable-line

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
    value: "Cloze",
    description: "Fill in the blank sentences and their answers",

    icon: CardTypeCloze,
  },
  {
    label: "Multiple choice",
    value: "Mcq",
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
//TODO: THis needs to be narrowed down
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
  | "Custom question"
  | "Definition"
  | "Translation"
  | "Explain"
  | "Discuss"
  | "Transcribe"
  | "Summarize"
  | "Turn to notes "
  | "Custom"
  | "Mcq"
  | "Jeopardy"
  | "Cloze";

export { cardTypes };

export type { CardType };
