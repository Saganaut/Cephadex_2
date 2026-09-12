import UpgradeIcon from "@assets/UpgradeIcon.svg?react";
import { Tooltip } from "@source/common/Form/Tooltip";
import { useAppSelector } from "@store/hooks";
import React from "react";

interface ExtrasOptionsButtonsProps {
  optionToPass: { value: string; type: string };
  toggleOption: (newSelected: string) => void;
  selected: string[];
}

interface ButtonContentProps {
  optionValue: string;
}

const ButtonContent: React.FC<ButtonContentProps> = ({ optionValue }) => (
  <div className="flex items-center justify-center ">
    <span>{optionValue}</span>
  </div>
);

const ExtrasOptionsButtons: React.FC<ExtrasOptionsButtonsProps> = ({
  optionToPass,
  toggleOption,
  selected,
}) => {
  const SUBSCRIPTION_PLAN_LIMIT = 2;
  const user = useAppSelector((state) => state.user.user);
  const isDisabled =
    (optionToPass.type === "premium" &&
      user.subscriptionPlan < SUBSCRIPTION_PLAN_LIMIT) ||
    optionToPass.type === "coming soon";

  const handleClick = (): void => {
    if (!isDisabled) {
      toggleOption(optionToPass.value);
    }
  };

  return (
    <div
      className={`relative inline-block  w-full min-w-min items-center  rounded-full border border-electric-violet-900 px-4 py-2 dark:border-aquamarine ${
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${
        selected.includes(optionToPass.value)
          ? "bg-aquamarine text-tolopea"
          : "text-electric-violet-900 dark:text-aquamarine"
      }`}
      onClick={handleClick}
    >
      <ButtonContent optionValue={optionToPass.value} />
      {(optionToPass.type === "premium" ||
        optionToPass.type === "coming soon") && (
        // <Tooltip text={optionToPass.type}> //!TODO implement this while not messing up the UI
        <UpgradeIcon className="absolute  bottom-3 right-[-10px] w-6" />
        // </Tooltip>
      )}
    </div>
  );
};

export { ExtrasOptionsButtons };
