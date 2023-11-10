import createWorksheetIcon from "@landingpage/LandingPageComponents/HowItWorksSection/assets/create-worksheet-icon.png";
import CustomDeckIcon from "@landingpage/LandingPageComponents/HowItWorksSection/assets/custom-deck-icon.png";
import MasterIcon from "@landingpage/LandingPageComponents/HowItWorksSection/assets/master-icon.png";
import SelectInputIcon from "@landingpage/LandingPageComponents/HowItWorksSection/assets/select-input-icon.png";
import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";

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

interface HowItWorksCardProps {
  image: string;
  title: string;
  text: string;
  link: string;
}
const HowItWorksCard: React.FC<HowItWorksCardProps> = ({
  image,
  title,
  text,
  link,
}) => {
  return (
    <div>
      <div className="flex items-center justify-center">
        <img className="h-20" src={image} alt={title} />
      </div>
      <h5 className="my-2 text-xl">{title}</h5>
      <p>{text}</p>

      <Link className="my-3 text-blaze-orange" to={link}>
        Study time
      </Link>
    </div>
  );
};

const HowItWorksSection = (): ReactElement => {
  return (
    <div className="p-10 md:h-screen">
      <div className="flex flex-col md:h-full">
        <div className="mb-5 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-electric-violet">
            How it works
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {HowItWorksContent.map((contentItem, index) => (
            <div key={index} className="w-full p-5 md:w-1/4">
              <HowItWorksCard {...contentItem} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export { HowItWorksSection };
