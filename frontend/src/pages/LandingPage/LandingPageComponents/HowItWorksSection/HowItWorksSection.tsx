import CreateDecksImg from "@assets/landingPage/CreateDecksImg.png";
import CreateQuizzesImg from "@assets/landingPage/CreateQuizzesImg.png";
import MasterSubjectsImg from "@assets/landingPage/MasterSubjectsImg.png";
import PlayImg from "@assets/landingPage/PlayImg.png";
import SelectInputImg from "@assets/landingPage/SelectInputImg.png";
import StudyImg from "@assets/landingPage/StudyImg.png";
import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";

import { SectionHeading } from "../../SectionHeading";

const HowItWorksContent = [
  {
    image: SelectInputImg,
    title: "Select Input",
    text: "Choose from a range of inputs, including PDFs, PowerPoint presentations, documents, audio files, web pages, and YouTube videos, to kickstart your learning journey.",
    link: "Select Input",
  },
  {
    image: CreateDecksImg,
    title: "Create Custom Decks",
    text: "Craft personalised decks filled with dynamic flashcards. These are the foundation of your learning adventure.",
    link: "Select Input",
  },

  {
    image: StudyImg,
    title: "Study",
    text: "Use our cutting-edge spaced repetition system to optimise your study sessions, ensuring maximum retention and efficiency.",
    link: "Select Input",
  },
  {
    image: PlayImg,
    title: "Play Games",
    text: "Dive into interactive games designed to make learning fun and competitive. Challenge yourself and your friends to reinforce knowledge.",
    link: "Select Input",
  },
  {
    image: CreateQuizzesImg,
    title: "Create Worksheets and Quizzes",
    text: "Harness the power of your custom decks to generate engaging worksheets and quizzes. Share them with peers, assign them as tasks, or use them for your personal study sessions.",
    link: "Select Input",
  },
  {
    image: MasterSubjectsImg,
    title: "Master Your Subjects",
    text: "Immerse yourself in learning with our spaced repetition system, interactive games, and other study tools, empowering you to truly master the content.",
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
    <div className=" min-h-[320px] rounded-xl  bg-mariana-blue/80 hover:bg-electric-violet p-7 text-white/80">
      <div className="flex items-center justify-center">
        <img className="h-20" src={image} alt={title} />
      </div>
      <h5 className="my-2 text-xl">{title}</h5>
      <p>{text}</p>

      {/* <Link className="my-3 text-blaze-orange" to={link}>
        Study time
      </Link> */}
    </div>
  );
};

const HowItWorksSection = (): ReactElement => {
  return (
    <div className="container  bg-transparent px-5 py-24  ">
      <SectionHeading title="How does it work?" message="It's super easy!" />

      <div className="-m-4 flex flex-wrap">
        {HowItWorksContent.map((contentItem, index) => (
          <div key={index} className="w-full p-5 md:w-1/2 lg:w-1/3 ">
            <HowItWorksCard {...contentItem} />
          </div>
        ))}
      </div>
    </div>
  );
};
export { HowItWorksSection };
