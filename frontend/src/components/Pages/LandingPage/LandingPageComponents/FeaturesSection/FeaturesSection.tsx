import React from "react";
import { FeatureCard } from "@pages/LandingPage/LandingPageComponents/FeaturesSection/FeatureCard.js";

const featuresContent = [
  {
    name: "teachers",
    title: "Teachers",
    image: "https://dummyimage.com/305x305",
    items: [
      "Turn your powerpoint presentations into quizzes",
      "Record your lectures and turn them into notes",
      "Assign quizzes and worksheets and let us grade them for you",
      "Engage your students by playing games wiht the content created",
      "Share your creations with your colleagues",
    ],
  },
  {
    name: "students",
    title: "Students",
    image: "https://dummyimage.com/305x305",
    items: [
      "Turn your notes, pdfs and ppts into quizzes to help you prepare for an upcoming exam",
      "Use our spaced repetition system to ensure you don't forget what you learn",
      "Use our AI tutor bot to answer all your questions",
      "Create your own content",
    ],
  },
  {
    name: "creators",
    title: "Content Creators",
    image: "https://dummyimage.com/305x305",
    items: [
      "Provide your viewers with tools to reinforce what they learn by watching your videos",
      "Use your content to create custom cards",
      "Engage and build a stronger community",
    ],
  },
];

const FeaturesSection = () => {
  return (
    <div className="lg:h-screen bg-mariana-blue">
      <section className=" ">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-aquamarine">
              Who's it for?
            </h1>
            <h2 className="text-xs text-white tracking-widest font-medium title-font mb-1">
              A variety of users
            </h2>
          </div>
          <div className="flex flex-wrap -m-4">
            <FeatureCard {...featuresContent[0]} />
            <FeatureCard {...featuresContent[1]} />
            <FeatureCard {...featuresContent[2]} />
          </div>
        </div>
      </section>
    </div>
  );
};

export { FeaturesSection };
