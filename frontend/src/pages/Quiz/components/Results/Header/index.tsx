// import { Filter } from "@common/Form/Filter";
import { RadioSwitchButton } from "@common/Form/RadioSwitchButton";
import { QuizService, type SingleQuizResultResponse } from "@source/client";
import { DeleteButton } from "@source/common/Buttons/IconButtons/DeleteButton";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { DeleteConfirmationModal } from "@source/common/Modals/DeleteConfirmationModal";
import { useModal } from "@source/lib/contexts/ModalContext";
import { useFetchUser } from "@source/lib/hooks/userHooks/useFetchUser";
import { formatDate } from "@source/lib/utils/functions";
import React from "react";
import { useNavigate } from "react-router-dom";

import { IncorrectInfo } from "./IncorrectInfo";
import { PointsInfo } from "./PointsInfo";
import { QuestionsInfo } from "./Questions";

interface HeaderProps {
  quizResults: SingleQuizResultResponse;
  collapse: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  correct: number;
  points: number;
}
const Header: React.FC<HeaderProps> = ({
  quizResults,
  setCollapse,
  collapse,
  correct,
  points,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const calculateDurationInMinutes = (
    startTime: string,
    endTime: string
  ): number => {
    const duration =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000;
    return Math.ceil(duration);
  };
  const { user } = useFetchUser();
  const { openSignInModal } = useModal();

  const duration = calculateDurationInMinutes(
    quizResults.quizResult?.startTime ?? "",
    quizResults.quizResult?.endTime ?? ""
  );

  const handleDelete = (): void => {
    if (quizResults.quizResult == null) return;
    void QuizService.deleteQuizResult(quizResults.quizResult.id);
    navigate("/quizzes");
  };

  return (
    <>
      {/*   Heading */}
      <div
        className={
          "flex flex-wrap justify-between rounded-t-[10px] bg-electric-violet-200  px-[32px] py-[25px] text-tolopea dark:dark:bg-mariana-blue dark:text-white"
        }
      >
        {/* Title */}
        <div className="flex-col items-center">
          <h1 className={"text-[28px] font-bold"}>{quizResults.quiz?.name}</h1>
          {user.id !== quizResults.quiz?.creator && (
            <p className={"text-sm"}>
              Your instructor will likely review your results - your final score
              may change.
            </p>
          )}
        </div>

        {/* Details    */}
        <div className={"flex gap-x-[25px] text-white"}>
          <QuestionsInfo
            numQuestions={quizResults.gradedResults?.length ?? 0}
          />
          {/*   Correct Answers */}
          <PointsInfo
            numCorrect={points}
            numPoints={quizResults.quiz?.points}
          />
          {/*   Incorrect Answers */}
          <div className="hidden sm:block">
            <IncorrectInfo
              numIncorrect={
                quizResults.gradedResults?.length != null && correct !== 0
                  ? quizResults.gradedResults?.length - correct
                  : 0
              }
            />
          </div>
        </div>
      </div>{" "}
      <div className="flex  justify-end bg-electric-violet-200 dark:bg-mariana-blue ">
        <div className="flex min-w-[220px] flex-col space-y-2 rounded-xl  p-4 text-xs text-tolopea dark:text-white">
          <div className="flex justify-between">
            <span className="font-semibold">Start:</span>
            <span>
              {formatDate(quizResults.quizResult?.startTime ?? "", true)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">End:</span>
            <span>
              {formatDate(quizResults.quizResult?.endTime ?? "", true)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Duration:</span>
            <span>{duration} min</span>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div
        className={
          "mt-1 flex w-full flex-wrap justify-between rounded-b-[10px] bg-electric-violet-200 px-[32px]  py-[14px] dark:bg-mariana-blue"
        }
      >
        <div className="flex items-center">
          {/* <Filter
            withSearch={false}
            withSort={true}
            setFilterValue={() => {}}
            dataArray={[]}
            sortOptions={[{ value: 0, label: "Category" }]}
            searchPlaceHolder={""}
          /> */}
          {user.guest ?? false ? (
            <StyledButton
              label="Register to save your results"
              onClick={() => {
                openSignInModal("register");
              }}
            />
          ) : (
            <h1
              className={"text-[22px] font-bold text-tolopea dark:text-white"}
            >
              {quizResults.quizResult?.takerUsername}{" "}
              <span className={" text-[20px] text-tolopea dark:text-white"}>
                ({quizResults.quizResult?.takerName})
              </span>
            </h1>
          )}
        </div>

        <div
          className={
            "mt-4 flex flex-wrap items-center gap-4 gap-x-[20px] text-tolopea dark:text-white sm:mt-0 sm:gap-4"
          }
        >
          <StyledButton
            label={"Return to quizzes"}
            onClick={() => {
              navigate("/quizzes");
            }}
            size="small"
          />
          <RadioSwitchButton
            isChecked={collapse}
            handleInputChange={() => {
              setCollapse(!collapse);
            }}
            label={"Collapse"}
          />
          <DeleteButton
            style="shallows"
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleDelete={handleDelete}
        title="Are you sure you want to delete this result?"
        message="Neither the quiz taker nor the creator will have access to this result if you do so."
      />
    </>
  );
};
export { Header };
