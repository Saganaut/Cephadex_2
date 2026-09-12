import CephCircleHappy from "@assets/bubbles/CephCircleHappy.png";




const introSteps = [
  {
    title: "Study time!",
    intro: `<div>
    <img src="${CephCircleHappy}"/>
    <p style="padding-top:20px">Time to study!  Let me give you a quick tour.</p>
        </div>`,
  },
  {
    title: "Dashboard",
    element: "#study-deck-header",
    intro:
      "You can find some info on how many cards are left in the batch and how well you are doing here.  With Cephadex cards are loaded in batches.  You can change the size of the batches in your settings but our algorithm works best when they aren't too big. ",
  },

  {
    title: "Study history",
    element: "#study-card-history",
    intro:
      "We'll keep track of all the cards you've studied this session, you can go back and revisit them at will.",
  },
  {
    title: "Flashcard",
    element: "#study-card-display",
    intro:
      "We'll show you the front of the card first - basically the question.  After you respond we'll show you the correct answer.",
  },
  {
    title: "Flashcard",
    element: "#study-card-display",
    intro:
      "If after seeing the correct answer you realize you actually don't know the answer just select 'lost it' (or a wrong answer in the case of multiple choice questions).",
  },
  {
    title: "Flashcard",
    element: "#study-card-display",
    intro:
      "If you want to get the best results from your study session make sure to be honest with yourself about how well you know the answer.  Our algorithm keeps track of how well you have learned a card and will display it again whenever it thinks you need a refresher.",
  },
  {
    title: "Flashcard",
    element: "#study-card-display",
    intro:
      "You can also use your keyboard arrow keys to navigate between cards on a desktop, or swipe left and right on mobile",
  },
  {
    title: "Flashcard",
    element: "#study-CTA-buttons",
    intro:
      "You can modify the card directly in your study session, but be careful this will affect the card in your deck.",
  },
  {
    title: "Chat bot",
    element: "#chat-bot-toggle",
    intro:
      "If you want more information on a card or need help with anything else you can always ask me.  Remember premium members can use '@files' to get answers directly from the content they uploaded.  It's also a great way to add some additional information to your cards.",
  },
  {
    title: "Happy Studying!",
    intro:
      "That's it for now.  If you have any questions don't hesitate to ask me or drop a message to my team.  We'll get back to you as soon as possible.  Happy studying!",
  },
];

export { introSteps };
