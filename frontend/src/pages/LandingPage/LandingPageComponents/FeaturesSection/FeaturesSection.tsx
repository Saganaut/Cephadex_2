import CreatorsImg from "@assets/landingPage/CreatorsImg.png";
import StudentsImg from "@assets/landingPage/StudentsImg.png";
import TeacherImg from "@assets/landingPage/TeacherImg.png";
import { FeatureCard } from "@pages/LandingPage/LandingPageComponents/FeaturesSection/FeatureCard.js";
import React, { type ReactElement } from "react";

import { SectionHeading } from "../../SectionHeading";

interface ContentItem {
  name: string;
  title: string;
  image: string;
  items: string[];
}

const featuresContent: ContentItem[] = [
  {
    name: "students",
    title: "Students",
    image: StudentsImg,
    items: [
      "Create personalised study materials effortlessly",
      "Convert your notes into flashcards and interactive quizzes ",
      "Use our AI tutor bot to answer all your questions",
      "Utilise our spaced repetition feature to optimise your learning process and ace your exams",
    ],
  },
  {
    name: "teachers",
    title: "Teachers",
    image: TeacherImg,
    items: [
      "Engage your students like never before with educational games",
      "Transform your presentations into interactive quizzes, making learning fun and effective",
      "Simplify your workload by assigning quizzes and worksheets, and let our platform handle the marking for you",
      "Easily record your lectures and convert them into comprehensive notes for your students",
      "Collaborate and share your educational content with fellow educators, fostering a community of learning",
    ],
  },

  {
    name: "creators",
    title: "Content Creators",
    image: CreatorsImg,
    items: [
      "Develop tailor-made content for your courses and classes",
      "Utilise your content to generate engaging cards and quizzes, enhancing learning experiences",
      "Easily collaborate with other content creators and students, enriching your materials and expanding your reach",
    ],
  },
];

const FeaturesSection = (): ReactElement => {
  return (
    <div className="container mx-auto bg-transparent px-5 py-24 ">
      <SectionHeading
        title="Who's it for?"
        message="Designed for Students, Teachers, and Content Creators: Simplify Your Teaching and Learning Experience with Our Tools!"
      />

      <div className="-m-4 flex flex-wrap">
        <FeatureCard {...(featuresContent[0] as ContentItem)} />
        <FeatureCard {...(featuresContent[1] as ContentItem)} />
        <FeatureCard {...(featuresContent[2] as ContentItem)} />
      </div>
    </div>
  );
};

export { FeaturesSection };
