import ShellIcon from "@assets/ShellIcon.svg?react";
import React from "react";

interface CreditCounterProps {
  creditCost: number;
  remainingCredit: number;
  premium: boolean;
}
const CreditCounter: React.FC<CreditCounterProps> = ({
  creditCost,
  remainingCredit,
  premium,
}) => {
  // let remainingCredit = 0;

  // if (user.remainingCredit != null) {
  //   remainingCredit = user.remainingCredit;
  // } else {
  //   remainingCredit = 0;
  // }
  const sufficientCredit = premium ? true : creditCost <= remainingCredit;

  const editedRemainingCredit = premium ? "unlimited" : remainingCredit;
  return (
    <>
      <div
        id="credit-cost"
        className="mb-2 rounded-lg border-2 border-dashed border-mariana-blue   p-4 text-xl text-tolopea dark:border-mariana-blue-100 dark:bg-transparent dark:text-white"
      >
        <div className="flex flex-row justify-end gap-3">
          {creditCost}
          {sufficientCredit ? (
            <ShellIcon className="h-6 w-6 cursor-pointer fill-tolopea dark:fill-aquamarine" />
          ) : (
            <ShellIcon className="h-6 w-6 cursor-pointer fill-red-500" />
          )}
        </div>
        <div className="text-xs">You have {editedRemainingCredit} credits</div>
      </div>
    </>
  );
};

export { CreditCounter };
