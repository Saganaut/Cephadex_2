import React from "react";
import { Link } from "react-router-dom";
import createWorksheetIcon from "@pages/LandingPage/LandingPageComponents/HowItWorksSection/assets/create-worksheet-icon.png";
import CustomDeckIcon from "@pages/LandingPage/LandingPageComponents/HowItWorksSection/assets/custom-deck-icon.png";
import MasterIcon from "@pages/LandingPage/LandingPageComponents/HowItWorksSection/assets/master-icon.png";
import SelectInputIcon from "@pages/LandingPage/LandingPageComponents/HowItWorksSection/assets/select-input-icon.png";
const HowItWorksContent = [
  {
    image: createWorksheetIcon,
    title: "Select Input",
    text: "Choose from a variety of inputs including pdfs, powerpoints, documents, audio files... or even web pages and youtube videos.",
    link: "Select Input",
  },
  {
    image: CustomDeckIcon,
    title: "Create Custom Decks",
    text: "Transform your input into custom cards of any type organized into decks.",
    link: "Select Input",
  },
  {
    image: SelectInputIcon,
    title: "Create Worksheets and Quizzes",
    text: "Use your custom decks to create worksheets and quizzes. Share, assign or study them yourself.",
    link: "Select Input",
  },
  {
    image: MasterIcon,
    title: "Master Your Subjects",
    text: "Use our spaced repetition system, games and other study tools to engage with the material and master the content.",
    link: "Select Input",
  },
];

const HowItWorksCard = ({ image, title, text, link }) => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <img className="h-20" src={image} alt={title} />
      </div>
      <h5 className="text-xl my-2">{title}</h5>
      <p>{text}</p>

      <Link className="text-blaze-orange my-3" to={link}>
        Study time
      </Link>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <div className="md:h-screen p-10">
      <div className="flex flex-col md:h-full">
        <div className="flex justify-center items-center mb-5">
          <h1 className="text-4xl font-bold text-electric-violet">
            How it works
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {HowItWorksContent.map((contentItem, index) => (
            <div key={index} className="w-full md:w-1/4 p-5">
              <HowItWorksCard {...contentItem} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export { HowItWorksSection };
