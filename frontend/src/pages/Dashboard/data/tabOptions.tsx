import DeckIcon from "@assets/DeckIcon.svg?react";
import GroupOctopusIcon from "@assets/GroupOctopusIcon.svg?react";
import QuizIcon from "@assets/QuizIcon.svg?react";
import StarfishWithBg from "@assets/StarfishWithBg.svg?react";
import Sunrise from "@assets/Sunrise.svg?react";
import React from "react";
const options = [
  {
    label: "All",
    value: "all",
    icon: <Sunrise className="h-8 w-8" />,
  },
  {
    label: "Decks",
    value: "Deck",
    icon: <DeckIcon className="h-8 w-8" />,
  },
  {
    label: "Quizzes",
    value: "Quiz",
    icon: <QuizIcon className="h-8 w-8" />,
  },
  {
    label: "Groups",
    value: "Group",
    icon: <GroupOctopusIcon className="h-8 w-8" />,
  },
  {
    label: "Saved",
    value: "saved",
    icon: <StarfishWithBg className="h-8 w-8" />,
  },
];

export { options };
