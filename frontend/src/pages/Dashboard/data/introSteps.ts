
import CephCircleHappy from "@assets/bubbles/CephCircleHappy.png";


const introSteps = [
  {
    title: "Welcome!",
    intro: `<div>
      <img src="${CephCircleHappy}"/>
      <p style="padding-top:20px">My name is Ceph, I will be your guide today. If you want to see any of the tutorials again you can go to your account --> settings to re-enable them.</p>
      </div>`,
  },
  {
    title: "Dashboard",
    element: "#dashboard-cards",
    intro:
      "We are currently in your main dashboard.  From here you can access all your Decks, Quizzes, and Groups. ",
  },
  {
    title: "Dashboard",
    element: "#chat-bot-toggle",
    intro:
      "You can click this button  to chat with me at any time.  Type '@cephadex' followed by your question if you need help using the platform.",
  },
  {
    title: "Navbar",
    element: "#navbar",
    intro:
      "Here you can access your notifications, switch between light and dark mode and access your account settings as well as a few other options.",
  },
  {
    title: "Sidebar",
    element: "#sidebar",
    intro:
      "You can access the side bar here to navigate to different parts of the platform.",
  },
  {
    title: "New Deck",
    element: "#sidebar",
    intro:
      "Let's start by creating a new deck.  Click on 'Create' to go to the deck creation page. (the first icon if you are in collapsed mode)",
  },
];

export { introSteps };
