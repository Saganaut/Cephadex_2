import { FeatureCard } from "@pages/LandingPage/LandingPageComponents/FeaturesSection/FeatureCard.js";
import React, { type ReactElement } from "react";

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

const FeaturesSection = (): ReactElement => {
  return (
    <div className="bg-mariana-blue lg:h-screen">
      <section className=" ">
        <div className="container mx-auto px-5 py-24">
          <div className="mb-20 flex w-full flex-col text-center">
            <h1 className="title-font text-2xl font-medium text-aquamarine sm:text-3xl">
              Who&apos;s it for?
            </h1>
            <h2 className="title-font mb-1 text-xs font-medium tracking-widest text-white">
              A variety of users
            </h2>
          </div>
          <div className="-m-4 flex flex-wrap">
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
