import CephCircleTie from "@assets/bubbles/CephCircleTie.png";



const introSteps = [
  {
    title: "My Quizzes",
    intro: `<div>
            <img src="${CephCircleTie}"/>
            <p style="padding-top:20px">Let me show you how to create and manage your quizzes.</p>
            </div>`,
  },
  {
    title: "Quiz types",
    element: "#quizzes-types",
    intro:
      "The quizzes you have created are displayed in 'My Quizzes', those that have been assigned to you in 'Assigned Quizzes', and the results of quizzes you have taken or assigned 'My Results'",
    position: "top",
  },
  {
    title: "Quiz section",
    element: "#my-quizzes",
    intro: "For now you only have one quiz, let's create a new one.",
    position: "top",
  },
  {
    title: "Create Quiz",
    element: "#page-header",
    intro: "Click on 'Create Quiz' to create your first quiz.",
  },

  {
    title: "Select a deck",
    intro:
      "The first step is selecting a deck from which to create your deck - choose one and I'll see you in the next section!",
  },
];

export { introSteps };
