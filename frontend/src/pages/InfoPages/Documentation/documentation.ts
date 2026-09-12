import ChatbotIcon from "@assets/Chatbot.svg";
import CommunityIcon from "@assets/CommunityIcon.svg";
import CreateIcon from "@assets/CreateIcon.svg";
import DeckIcon from "@assets/DeckIcon.svg";
import GameIcon from "@assets/GameIcon.svg";
import GroupOctopusIcon from "@assets/GroupOctopusIcon.svg";
import QuizIcon from "@assets/QuizIcon.svg";
import StudyIcon from "@assets/StudyIcon.svg";

interface SectionType {
  sectionTitle: string;
  sectionSummary: string;
  sectionitems: string[];
}
interface GuideType {
  mainTitle: string;
  useSummary: string;
  sections: SectionType[];
  icon: string;
}

const CreateGuide: GuideType[] = [
  {
    mainTitle: "Create",
    useSummary:
      "Use this feature to create decks of flashcards as well as other documents such as notes, summaries, transcriptions, or revision questions",
    icon: CreateIcon,
    sections: [
      {
        sectionTitle: "How it works?",
        sectionSummary: "The creation process is divided into 3 parts.",
        sectionitems: [
          "Choose content to use: 3 choices: * An existing document (pdf, doc, ppt, .txt, mp3, wav) *Copy/paste some text *Insert a youtube or wikipedia link (or a series of links separated by a comma).",
          "Choose what you want to make:  Decide what kind of content you want to create.  Mix will create a mix of definitions and multiple choice question flashcards.  Other options are translations, fill in the blanks or creating custom cards. ",
          "Choose how you want to save the content: either choose to create a new deck or add it to an existing deck.",
        ],
      },
      {
        sectionTitle: "Custom cards",
        sectionSummary: "How can you create them effectively?",
        sectionitems: [
          "For custom cards you will be asked to fill out two fields.  The first one corresponds to what you would like on the front of the card - essentially the question, and the second one to the back of the card - the answer.",
          "For example if inputting a passage for an English Lit class you could ask for `metaphors and idioms` as the front of card, and then `explanations and additional examples` for the back of card.",
          "Illustrating this with another example, we can imagine entering some economic reading and asking for `economic theories and concepts` for the front of card and `detailed explanations and limitations` for the back of card.",
        ],
      },
      {
        sectionTitle: "Credits",
        sectionSummary: "All about how we use credits",
        sectionitems: [
          "Credits allow you to create decks.",
          "When you select your input we will calculate the credit cost and inform you.",
          "One credit is equivalent to one page of content or one minute worth of audio.",
          "If for some reason your deck creation fails credits will be reimbursed.",
        ],
      },
      {
        sectionTitle: "Notes",
        sectionSummary: "Important things to keep in mind.",
        sectionitems: [
          "You must select at least some content and either a name for a new deck or an existing deck for the `create` button to be active.",
          "Once the process is launched you don't have to remain on the page. A pop up will appear notifying you when your deck is ready, if you go to the decks page (or refresh the decks page) you'll see your deck with the cards inside.",
          "Depending on the size of the content and how busy our servers are, this process can take anywhere from a few seconds to a few minutes.",
          "We really appreciate any feedback on this creation process. Is there something you would like to see that is not currently there? Let me know and if we can we will implement it.",
        ],
      },
    ],
  },
];

const DeckGuide: GuideType[] = [
  {
    mainTitle: "Decks",
    icon: DeckIcon,
    useSummary:
      "All your content is stored in decks, use them to study, create quizzes, play games or share them with others.",
    sections: [
      {
        sectionTitle: "Managing your Decks",
        sectionSummary: "How to organize your knowledge base",
        sectionitems: [
          "You will find all your decks in the decks page or in the dashboard.  From there click on any deck to view its content and manage it.",
          "Decks can be organized hierarchically.  Put decks within decks to create a tree structure.  This is useful for organizing your content.  To do so go to your desired deck, open the side bar and click on the edit icon to add a new relationship.",
          "During the deck creation process you have the option of specifying details for your deck such as subject, topic... If you leave it blank we will auto-populate on for you. You can edit this as well as the deck image by clicking on the edit button near the name of the deck.",
        ],
      },
      {
        sectionTitle: "Managing your Cards",
        sectionSummary: "Adding, editing and deleting cards",
        sectionitems: [
          "Edit any card by clicking on the card and editing the values directly.",
          "Create cards manually by clicking on the `add card` button.  You will be asked to include the type of card, what you want to appear on the front and what you want to appear on the back.",
          "Paid subscribers can use our AI Bot directly to generate the back of the card, both for new cards and editing existing cards.  Simply click Generate with AI.",
          "Delete cards by clicking on the Delete button.",
          "Cards can be copied individually to other decks, click on the dropdown menu on the card and then enter the name of the deck you want to copy it to.",
        ],
      },
      {
        sectionTitle: "Sharing",
        sectionSummary:
          "We have many ways for you to share your deck, as well as export or import cards",
        sectionitems: [
          "To share a deck click on the Share button by the deck name.  Create a public link, send it directly to an email recipient (whether they are a user or not) or share directly to social media.",
          "Make your deck publically available to all users.  Just keep in mind that if you then edit your deck it will also edit the public version.",
          "Export a deck to a csv file.  This is useful if you want to use the cards in another program or share them with someone who does not have a Cephadex account.",
          "Import a csv file to create a new deck.  This is useful if you have a lot of cards you want to add quickly.",
          "The CSV format must follow exactly the format of the exported CSV file.  If you are unsure how to do this, export a deck and use that as a template.",
          "Paid subscribers can also import and export directly to Anki - a popular flashcard program.  In order to do so you must be on a desktop, have anki installed and the anki connected plugin open.",
        ],
      },
      {
        sectionTitle: "Documents",
        sectionSummary:
          "Your documents are stored in your decks, view them, edit them and delete them.",
        sectionitems: [
          "Your documents are stored in your decks, this is where you will find summaries, notes, source material, transcriptions and more.",
          "Find your documents by opening the side bar.",
          "Edit your documents, delete them or download them by opening them and clicking on the appropriate button.",
          "If you are a premium subscriber your source material is what is used to answer questions when asking Ceph (our tutor bot) if you use the '@files' command - deleting one of these source materials will make it unavailable to Ceph.",
        ],
      },
      {
        sectionTitle: "Quizzes",
        sectionSummary:
          "Access your quizzes from the decks page.  Quizzes are created from your decks and can be used to test your knowledge.",
        sectionitems: [],
      },
    ],
  },
];

const StudyGuide: GuideType[] = [
  {
    mainTitle: "Study",
    icon: StudyIcon,
    useSummary:
      "Our spaced repetition system gives you an efficient way to study your decks",
    sections: [
      {
        sectionTitle: "Spaced Repetition",
        sectionSummary: "What is it and how does it work?",
        sectionitems: [
          "Spaced repetition is a learning technique that incorporates increasing intervals of time between subsequent review of previously learned material in order to exploit the psychological spacing effect. It forces learning to be effortful, and like muscles, the brain responds by strengthening the connections between nerve cells. By spacing the intervals out, you're  exercising these connections with each repetition.",
          "You will swipe through cards and answer them.  The system will then decide when to show you the card again based on your answer.",
          "The more often you get a card correct the longer the interval between reviews.  This is because the system assumes you know the card well and don't need to review it as often.",
          "We will keep showing you cards until we are confident you know them well.  This is why you may see the same card multiple times in a row.",
          "Change your answer after viewing the answer but we recommend you be as honest as possible with the system for best results.",
        ],
      },
      {
        sectionTitle: "Settings",
        sectionSummary: "Change the settings of the study session",
        sectionitems: [
          "If you go to your account, then go to the settings tab you will find your spaced repetition settings.",
          "We don't recommend changing these settings.  They are set to what we believe is the most efficient way to study.  However, if you feel you are not getting the results you want you can try changing them.",
          "Change the settings of the AI tutor Ceph.",
          "Set the amount of cards to load before we start showing you new cards, as well as the number of cards to load at once.  If you choose values that are too high you may be overwhelmed by new cards and not memorize the cards you are currently learning as effectively.",
          "Change the multipliers for the cards in the different learning buckets.  This is how much we will increase the interval between reviews based on your nswer.",
          "When you have a number of correct answers in a row we give you a bonus, set the number of correct answers needed for this bonus as well as the bonus multiplier here.",
          "Cards have a certain due date, by adjusting the 'retrieve cards due within X minutes' adjust the cards we will fetch.  For example if you set this to 10 minutes we will fetch all the cards that will be due within the next 10 minutes.",
          "There is a maximum interval of one year. This is the maximum time we will wait before showing you the card again.",
        ],
      },
      {
        sectionTitle: "Notes",
        sectionSummary: "Some important things to keep in mind",
        sectionitems: [
          "Cards are editable directly in the study session, if you edit them here it will change the card in your deck.",
          "Similarly if you delete the card it will also delete the card in your deck.",
          "If you are on a desktop use the up key to say you know the card and the down key to say you don't know the card.  Cycle through cards with the left and right arrow.  This will not work for multiple choice questions.",
        ],
      },
    ],
  },
];

const QuizzesGuide: GuideType[] = [
  {
    mainTitle: "Quizzes",
    icon: QuizIcon,
    useSummary: "Create, share, assign take and grade quizzes",
    sections: [
      {
        sectionTitle: "Creating a quiz ",
        sectionSummary: "Create quizzes from your decks",
        sectionitems: [
          "All quizzes are created from decks.",
          "To create a new quiz, go to my quizzes and click on Create quiz.",
          "After selecting one of your decks all your cards will be displayed in a list.  Select the cards you want to include in the quiz by clicking on them.",
          "Set a due date and time limit for the quiz, set instructions and modify the name by clicking on the quiz name or the quiz details icon on the left.",
          "Jeopardy mode will switch around the questions and answers, this is useful for studying.  So for example for definitions questions, jeopardy mode would make the definition the question and the term the answer - for multiple choice questions will become regular questions if this is enabled.",
          "Click on the plus sign by a question will open up a window that allows you to swipe through each question and select it or not.",
          "If you edit the questions here this will modify the cards directly in your decks.  If you only want to edit the question without changing the quiz you should first create the quiz then edit it.",
          "Re-order the questions by grabbing them and moving them to the desired position.",
          "Adjust how many points each question is worth by clicking on the up and down arrows in the 'marks' field.",
          "Once done click Create quiz - you ll be taken to a summary page from which you can share/assign the quiz, take it or edit it.",
        ],
      },
      {
        sectionTitle: "Sharing a quiz",
        sectionSummary: "Many ways to share your quiz",
        sectionitems: [
          "Assigning a quiz to a user - if you enter a user's email the quiz will be assigned to them and only to them.  Set multiple emails at once separated by a comma.",
          "We will notify of users that they have been assigned a quiz with an alert in the app.",
          "If you enter an email of someone who is not a user we will send them an email with a link to the quiz.  They will be able to take the quiz without creating an account.",
          "Make the quiz publically available to unregistered users.  To do so just get the link or QR code or share it directly on social media.",
          "Access the results of the quiz taken by users, for unregistered users we do not save their results.",
          "Once a user takes one of your quizzes you will have the ability to manually grade their answers and change their scores should you choose to do so.",
        ],
      },
      {
        sectionTitle: "Taking a quiz",
        sectionSummary: "A few things to note",
        sectionitems: [
          "Before taking the quiz instructions will be displayed as well as the due date and time limit.",
          "If the creator has set the quiz to no re-take, once you have taken the quiz you will not be able to take it again.",
          "Quizzes cannot be taken after a the due date has passed if the creator has set this option.",
          "Once you have completed the quiz you will be shown your results and the correct answers - the score displayed is tentative and can be changed by the quiz creator.  Only multiple choice quiz scores are completely accurate without human intervention.",
          "Every time you take a quiz a new results page is created.  Access all your results from the results page.",
        ],
      },
      {
        sectionTitle: "Quiz dashboard",
        sectionSummary: "Quizzes overview",
        sectionitems: [
          "My quizzes: shows you all the quizzes you have created.",
          "Assigned quizzes: shows you the quizzes that have been assigned to you.",
          "Results: the results of quizzes you have taken as well as your grades for quizzes you have created.",
        ],
      },
      {
        sectionTitle: "Printing and downloading",
        sectionSummary: "Create versions to use outside of the app",
        sectionitems: [
          "Download the quiz as a pdf, this is useful if you want to print it out and take it on paper or use it in a classroom context.",
          "Print out answer keys for the quiz.",
          "Paid subscribers can print the quiz without our logo.",
        ],
      },
      {
        sectionTitle: "Notes",
        sectionSummary: "Some important things to keep in mind",
        sectionitems: [
          "If you delete a quiz it will delete all results and the quiz itself.",
          "Deleting a result deletes it for everyone, the creator of the quiz and the taker.",
        ],
      },
    ],
  },
];

const GameGuide: GuideType[] = [
  {
    mainTitle: "Play",
    icon: GameIcon,
    useSummary: "Fun ways to learn",
    sections: [
      {
        sectionTitle: "Cepha-flex ",
        sectionSummary:
          "Compete to see who knows the deck best and who is able to deceive the others",
        sectionitems: [
          "To create a game first select a deck to play with",
          "You will then be prompted to select some game settings, after which you will get a link to share and invite others.  This is game is made for 2 to 10 players.",
          "There are two ways to gain points.  Either by writing an answer that others find convincing enough to vote for as the correct answer, or to vote for the right answer yourself.",
          "Each round has two phases.  In the first phase you will be shown the question - which is the front of card of a random card in the deck selected.  You will then have a set amount of time to write the best answer possible.",
          "In the second phase you will be shown all the answers players have submitted as well as the official correct answer.  You will then choose which answer you think is the correct one.",
          "At the end of the round points are totalled and displayed before moving on to the next round.",
          "When the host decides to end the game or when the last round is over the final scores are displayed.",
        ],
      },
    ],
  },
];

const GroupGuide: GuideType[] = [
  {
    mainTitle: "Groups",
    icon: GroupOctopusIcon,
    useSummary: "Share your decks privately",
    sections: [
      {
        sectionTitle: "Managing groups",
        sectionSummary: "",
        sectionitems: [
          "To create a group go to Groups and click create group - you will be prompted to enter some information about the group.",
          "Invite users to the group by entering their email addresses - if the email is not associated with an account we will send them an email inviting them to create an account - otherwise the user will receive an in app notification.",
          "Manage permissions and remove users from the group by clicking on the edit icon in the members section.",
          "Add decks to the group by clicking on the Add Deck button.",
          "Once decks are added they will be available to all members of the group to copy or download as a CSV file.",
        ],
      },
    ],
  },
];

const CommunityGuide: GuideType[] = [
  {
    mainTitle: "Community",
    icon: CommunityIcon,
    useSummary: "Publically available decks",
    sections: [
      {
        sectionTitle: "Search and copying",
        sectionSummary: "",
        sectionitems: [
          "Search for publically available decks, search by name, topic or subject.",
          "To make one of your decks available here simply set it as public in the deck settings.",
          "Copy a deck by clicking on the Copy button.",
        ],
      },
    ],
  },
];

const TutorBotGuide: GuideType[] = [
  {
    mainTitle: "Tutor Bot",
    icon: ChatbotIcon,
    useSummary: "Have a question?  Ceph is here to help!",
    sections: [
      {
        sectionTitle: "How to use Ceph",
        sectionSummary: "",
        sectionitems: [
          "If you have a question about using Cephadex simply ask Ceph - type '@cephadex' followed by your question.  For example '@cephadex how do I create a deck?'",
          "If you get stuck while studying ask Ceph and see if it can help you out.",
          "You will find Ceph in the study page, individual decks page and the dashboard, of course they won't show up to help you while taking a quiz.",
          "For premium users query Ceph about your source material by typing '@files' followed by your question.  For example '@files What were the events that led to the American revolution?'.  This is particularly useful for getting reliable answers and avoiding the problem of hallucination that often plagues AI.",
        ],
      },
    ],
  },
];

const Guide = [
  ...CreateGuide,
  ...DeckGuide,
  ...StudyGuide,
  ...TutorBotGuide,
  ...QuizzesGuide,
  ...GameGuide,
  ...GroupGuide,
  ...CommunityGuide,
];

export { Guide };
export type { GuideType };
export type { SectionType };
