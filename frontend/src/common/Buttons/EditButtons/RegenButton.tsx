import Chatbot from "@assets/Chatbot.svg?react";
import { HelmSpinner } from "@source/common/Animations/Spinners/HelmSpinner";
import React from "react";

interface GenAiButtonProps {
  onClick: () => void;
  loading: boolean;
  label: string;
}
const GenAiButton: React.FC<GenAiButtonProps> = ({
  onClick,
  loading,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className={"flex flex-col items-center justify-center"}>
      <div
        className={
          "flex size-[48px] items-center justify-center rounded-full bg-mariana-blue hover:hover:bg-blaze-orange"
        }>
        {loading ? (
          <HelmSpinner
            style={"small"}
            color='fill-blaze-orange max-h-[100px] sm:max-h-none'
          />
        ) : (
          <Chatbot className={"h-[38x] w-[38px] "} />
        )}
      </div>
      <p
        className={
          "hidden py-2 font-medium text-tolopea dark:text-white sm:block"
        }>
        {label}
      </p>
    </button>
  );
};

export { GenAiButton };
