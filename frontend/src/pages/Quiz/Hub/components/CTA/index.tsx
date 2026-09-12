import ShareIcon from "@assets/cardMenuIcons/ShareIcon.svg?react";
import PenEditIcon from "@assets/EditPenIcon.svg?react";
import PrintIcon from "@assets/PrintIcon.svg?react";
import { Button } from "@source/common/Buttons/Button";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { RadioSwitchButton } from "@source/common/Form/RadioSwitchButton";
import { AssignQuizModal } from "@source/pages/Quizzes/components/AssignQuizModal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CTAProps {
  isCreator: boolean;
  quizId: number;
  quizShareId: string | null;
  canRetake: boolean;
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}
const CTA: React.FC<CTAProps> = ({
  isCreator,
  quizId,
  quizShareId,
  canRetake,
  showResults,
  setShowResults,
}) => {
  const navigate = useNavigate();
  const [openShareModal, setOpenShareModal] = useState(false);

  const handleTakeQuiz = (): void => {
    navigate(
      `/quiz/${quizId}${quizShareId != null ? `?shareId=${quizShareId}` : ""}`
    );
  };

  const handlePrintQuiz = (): void => {
    navigate(`/quiz/print/${quizId}`);
  };
  return (
    <div className="mt-[4px] flex flex-wrap items-center justify-between gap-6 rounded-b-[10px] bg-electric-violet-200 px-[20px] py-[9px] text-tolopea dark:bg-mariana-blue dark:text-white sm:gap-0 sm:px-[40px] sm:py-[18px]">
      <div className="flex justify-start gap-4 sm:gap-20 ">
        {isCreator && (
          <div
            onClick={() => {
              navigate(`/quiz/edit/${quizId}`);
            }}
            className="flex cursor-pointer items-center gap-x-[8px]"
          >
            <PenEditIcon />
            <p> Edit</p>
          </div>
        )}
        {isCreator && (
          <div
            className="flex cursor-pointer items-center gap-x-[8px] "
            onClick={() => {
              setOpenShareModal(!openShareModal);
            }}
          >
            <ShareIcon className=" h-[18px] w-[18px] fill-aquamarine text-aquamarine" />
            <p>Share</p>
          </div>
        )}
        {isCreator && (
          <div
            className="flex cursor-pointer items-center gap-x-[8px] "
            onClick={handlePrintQuiz}
          >
            <PrintIcon className=" h-[18px] w-[18px]  " />
            <p>Print</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-[40px] sm:gap-x-[20px]">
        {(isCreator || canRetake) && (
          <StyledButton label="Take Quiz" onClick={handleTakeQuiz} />
        )}

        <RadioSwitchButton
          label="See results"
          isChecked={showResults}
          handleInputChange={() => {
            setShowResults(!showResults);
          }}
        />
      </div>
      <AssignQuizModal
        isOpen={openShareModal}
        setIsOpen={setOpenShareModal}
        quizId={quizId ?? 0}
      />
    </div>
  );
};
export { CTA };
