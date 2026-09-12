import CephCircleTie from "@assets/bubbles/CephCircleTie.png";


const introSteps = [
  {
    title: "Deck creator",
    intro: `<div>
    <img src="${CephCircleTie}"/>
    <p style="padding-top:20px">I'm going to show you how we create a deck.  Decks are at the center of everything with Cephadex.</p>
      </div>`,
  },
  {
    title: "Input your content",
    element: "#input-type",
    intro:
      "The first step is to enter some  content from which we can create your deck.",
  },
  {
    title: "Files",
    element: "#file-input",
    intro:
      "You can upload a file to create your deck.  We accept pdfs, pptx, docx, and txt files.  Additionally you can use audio files such as wav or mp3",
  },
  {
    title: "Link",
    element: "#link-input",
    intro:
      "Another option is to enter a link.  You can enter any link (such as a wikipedia page) and even links to youtube videos.  We will extract the content for you.",
  },
  {
    title: "Text",
    element: "#text-input",
    intro:
      "You can also just copy/paste the text you want us to process here.  Just make sure it's not too short.  It should be at least a page worth of content.",
  },
  {
    title: "Choose your input",
    element: "#overall-input",
    intro: "Go ahead and enter your content.",
  },
  {
    title: "Card type",
    element: "#card-type",
    intro:
      "We have lots of different card types to choose from.  The default option is a mix of definition and multiple choice questions.  But you can also choose translations, fill in the blanks, or even completely custom cards.",
  },
  {
    title: "Extras",
    element: "#extras",
    intro:
      "We have a few extra options to choose from.  Save text will allow you to chat with your documents through our tutor bot.  Simply ask any question precedeed by '@files' and we will only use your content to answer",
  },
  {
    title: "Language ",
    element: "#language-select",
    intro:
      "If you have selected the translate option or want your content in a language other than English make sure to specify that here.",
  },
  {
    title: "New Deck",
    element: "#credit-cost",
    intro:
      "We'll let you know the credit cost here.  Premium members have unlimited credits otherwise 1 credit = 1 page (or 1 min for audio).",
  },
  {
    title: "Next",
    element: "#create-next-button",
    intro: "When you have all this filled in click 'next'.",
  },
  {
    title: "New deck or existing deck",
    element: "#new-existing-deck",
    intro:
      "Now you can choose to put the content in a new deck or an existing one. ",
  },
  {
    title: "New deck",
    element: "#new-deck",
    intro:
      "Since you only have a sample deck for now, let's create a new one.  You only need to enter a name, you can leave the rest blank for now.",
  },
  {
    title: "A couple more options",
    element: "#introjs-top-aligned",
    intro:
      "Specifying a subject and a level of detail can help improve the quality of the results.  These fields are optional.",
  },
  {
    title: "Next",
    element: "#create-next-button",
    intro: "Almost there!  Click 'Next' to continue",
  },
  {
    title: "Create",
    element: "#create-submit-button",
    tooltipClass: "tooltip-top",
    intro:
      "We're all set - just click 'Create' to finish up.  It should take a few seconds to a minute to create your deck.  Once it's ready I'll see you again within the deck section.",
  },
];

export { introSteps };
