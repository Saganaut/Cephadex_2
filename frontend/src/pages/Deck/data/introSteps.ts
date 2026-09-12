
import CephCircleTie from "@assets/bubbles/CephCircleTie.png";


const introSteps = [
  {
    title: "Deck Overview",
    intro: `<div>
          <img src="${CephCircleTie}"/>
          <p style="padding-top:20px">Let's explore your decks content.</p>
          </div>`,
  },
  {
    title: "Page Header",
    element: "#page-header",
    intro:
      "We'll show you some info on your deck here.  You can also edit the deck attributes or share the deck by clicking on the icons by the deck name.",
  },
  {
    title: "Card container",
    element: "#card-container",
    intro:
      "All the cards in your deck are here.  Edit them, copy them, or inspect the different learning stats for each card.",
    position: "top",
  },
  {
    title: "Side container",
    element: "#side-container",
    intro:
      "Open up the side container here, it contains your documents, the deck relationships and links to any quizzes created with this deck",
  },

  {
    title: "Importing and exporting",
    element: "#deck-controls",
    intro:
      "Add cards manually, import or export your cards here.  Import or export a deck using CSV files.  We also support integration with Anki.",
  },
  {
    title: "And much more!",
    intro:
      "Create quizzes, play games with your decks, or study them directly.  Head on over to the sidebar to explore more options.",
  },
];

export { introSteps };
