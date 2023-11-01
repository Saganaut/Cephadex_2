import { NavBarButton } from "@app/Dashboard/NavBar/NavBarButtons";
import { useAppSelector } from "@store/hooks";
import React, { useState } from "react";

const filterButtons = [
  {
    name: "All",
    value: "",
    icon: "fas fa-filter",
    count: "",
  },
  {
    name: "Decks",
    value: "Deck",
    icon: "fas fa-filter",
    count: "",
  },
  {
    name: "Quizzes",
    value: "Quiz",
    icon: "fas fa-filter",
    count: "",
  },
  {
    name: "Saved",
    value: "Saved",
    icon: "fas fa-filter",
    count: "",
  },
];

const SelectionButtonContainer: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("");

  const cardsData = useAppSelector((state) => state.cards);
  const cardCount = cardsData.length;
  const quizCount = cardsData.filter((card) => card.type === "Quiz").length;
  const deckCount = cardsData.filter((card) => card.type === "Deck").length;
  const favCount = cardsData.filter((card) => card.fav).length;

  console.log("In Parent: ", setSelectedFilter);

  const filterButtonsWithCount = filterButtons.map((button) => {
    if (button.name === "All") {
      return { ...button, count: `(${cardCount})` };
    }
    if (button.name === "Decks") {
      return { ...button, count: `(${deckCount})` };
    }
    if (button.name === "Quizzes") {
      return { ...button, count: `(${quizCount})` };
    }
    if (button.name === "Saved") {
      return { ...button, count: `(${favCount})` };
    }
    return button;
  });

  return (
    <div className="mx-2 flex h-10  flex-row rounded-full bg-mariana-blue">
      {filterButtonsWithCount.map((filter, index) => (
        <div
          key={index}
          className={`${index !== 0 && "ml-2"} ${
            index !== filterButtons.length - 1 && "mr-2"
          }`}
        >
          <NavBarButton
            filter={filter}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </div>
      ))}
    </div>
  );
};

export { SelectionButtonContainer };
