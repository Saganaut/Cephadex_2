import introVideo from "@assets/cephadex-intro-vid.mp4";
import { HowItWorksButton } from "@common/Form/Buttons/HowItWorksButton";
import { SignUpButton } from "@common/Form/Buttons/SignUpButton";

import { useModal } from "@source/lib/contexts/ModalContext.js";
import React, { type ReactElement } from "react";

const IntroVideo = (): ReactElement => {
  return (
    <div>
      <div className="overflow-hidden rounded-xl">
        <video className="h-80 w-auto" controls>
          <source src={introVideo} type="video/mp4" />
        </video>
      </div>
      <div className="flex flex-row  px-2">
        <div className="basis-1/2">
          <h2 className="text-xs text-gray-400">So many options!</h2>
        </div>
        <div className="basis-1/2">
          <h2 className="text-xs text-gray-400">Over 60 000 cards created.</h2>
        </div>
      </div>
    </div>
  );
};

const CallToAction = (): ReactElement => {
  const { openRegisterModal } = useModal();

  return (
    <div>
      <h1 className="hero-title text-white">
        Your Personalized <br /> Education Solution
      </h1>
      <div className="text-white">
        <p>
          Whether you&apos;re a teacher, student, content creator, or parent,
          Cephadex is your platform for customized, effective learning. Join us
          and experience our innovative approach to education.
        </p>
      </div>
      <div className="p-3">
        <SignUpButton
          onClick={() => {
            openRegisterModal();
          }}
          label="Try it free today!"
        ></SignUpButton>
        <HowItWorksButton label="How it works?" onClick={() => {}} />
      </div>
    </div>
  );
};

export { CallToAction };
export { IntroVideo };
