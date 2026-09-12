import React from "react";

interface StepsProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const StepsProgressBar: React.FC<StepsProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const width = (currentStep / totalSteps) * 100;

  return (
    <>
      <div className="text-tolopea dark:text-white">
        {" "}
        Step {currentStep} of {totalSteps}
      </div>
      <div className="w-full rounded-full bg-electric-violet  ">
        <div
          className="h-2 rounded-full bg-aquamarine p-0.5 text-center text-xs font-medium leading-none text-aquamarine"
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </>
  );
};

export { StepsProgressBar };
