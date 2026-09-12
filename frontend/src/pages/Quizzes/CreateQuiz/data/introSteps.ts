import CephCircleTie from "@assets/bubbles/CephCircleTie.png";


const introSteps = [
  {
    title: "Create a quiz",
    intro: `<div>
    <img src="${CephCircleTie}"/>
    <p style="padding-top:20px">Let's create our first quiz!</p>
              </div>`,
  },
  {
    title: "Quiz details",
    element: "#create-quiz-heading",
    intro:
      "Here you'll find your quiz options.  Clicking on the icon on the left will open a new section where you can modify quiz details such as its name, description or even set a time limit or due date.",
    position: "bottom",
  },
  {
    title: "Quiz toggles",
    element: "#create-quiz-heading",
    intro:
      "Toggle collapse to show the full details for each question.  Jeopardy will make questions into answers and vice versa. ",
    position: "bottom-right-aligned",
  },
  {
    title: "Select your questions",
    element: "#question-selection",
    intro:
      "Select which questions you want to include.  You can expand them individually by clicking on the arrow icon.  If you want to change the order just drag the question to the desired position by clicking and holding down on the 6 dots to the left.",
  },
  {
    title: "Select your questions",
    element: "#question-selection",
    intro:
      "You can also change the points or edit the question itself.  Be careful though, this will also edit the card in your deck.",
  },
  {
    title: "Create",
    element: "#create-quiz-button",
    intro:
      "Once you've selected the questions you want to include, just click the create button and you're done.  Your quiz will show up in 'My Quizzes'.  From there you can assign/share it, edit it, print it out or just take it yourself!",
  },
];

export { introSteps };
