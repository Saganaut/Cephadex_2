import CephCircleHappy from "@assets/bubbles/CephCircleHappy.png";
import CephCircleOne from "@assets/bubbles/CephCircleOne.png";
import CephCircleSad from "@assets/bubbles/CephCircleSad.png";
import CephCircleTie from "@assets/bubbles/CephCircleTie.png";
import CephCircleTwo from "@assets/bubbles/CephCircleTwo.png";
import CephCircleUnsure from "@assets/bubbles/CephCircleUnsure.png";
import React from "react";

import { SpeechBubble } from "./SpeechBubble";

interface SpeakingCephProps {
  text: string;
  type?: "info" | "sad" | "happy" | "unsure" | "default" | "teacher";
  textColor?: string;
  bgColor?: string;
}
const SpeakingCeph: React.FC<SpeakingCephProps> = ({
  text,
  type,
  bgColor = "bg-electric-violet-900",
  textColor = "text-white",
}) => {
  const image =
    type === "info"
      ? CephCircleTwo
      : type === "sad"
      ? CephCircleSad
      : type === "happy"
      ? CephCircleHappy
      : type === "unsure"
      ? CephCircleUnsure
      : type === "teacher"
      ? CephCircleTie
      : CephCircleTwo;

  return (
    <>
      <div className=" flex justify-center align-middle text-xs sm:p-4 sm:text-xl">
        <img
          className="relative flex h-[100px] justify-center p-4 align-middle md:h-[200px]"
          src={image}
        ></img>
        <SpeechBubble text={text} bgColor={bgColor} textColor={textColor} />
      </div>
    </>
  );
};

export { SpeakingCeph };
