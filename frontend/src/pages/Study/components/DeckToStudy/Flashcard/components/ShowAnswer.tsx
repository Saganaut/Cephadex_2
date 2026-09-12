import { Button } from "@source/common/Buttons/Button";
import React from "react";

interface ShowAnswerProps {
  onClick: () => void;
}
const ShowAnswer: React.FC<ShowAnswerProps> = ({ onClick }) => {
  return (
    <>
      {" "}
      <Button
        className={
          "bg-mariana-blue-100 px-8 py-2 text-[22px] transition-all duration-100 ease-linear hover:scale-105 hover:bg-electric-violet hover:text-white dark:bg-mariana-blue lg:px-12"
        }
        label={"Reveal"}
        onClick={onClick}
      />
    </>
  );
};

export { ShowAnswer };
