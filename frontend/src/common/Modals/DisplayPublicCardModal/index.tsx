import { ModalWrapper } from "@common/Modals/ModalWrapper";
import type {
  CardSchema,
  PublicCardSchema,
  StudyCardSchema,
} from "@source/client";
import { Loading } from "@source/common/InfoComponents/Loading";
import { McqOption } from "@source/common/Questions/Mcq/McqOption";
import type { CombinedSchema } from "@source/pages/Quizzes/components/CreateQuizQuestionItem/Question";
import { BackCardDefinition } from "@source/pages/Study/components/DeckToStudy/Flashcard/components/BackCardDefinition";
import { FrontCardHeader } from "@source/pages/Study/components/DeckToStudy/Flashcard/components/FrontCardHeader";
import React from "react";

import { FrontBackTag } from "../EditCardContentModal/components/FrontBackTag";

type CardTypes = StudyCardSchema | CardSchema | CombinedSchema;

export type HandleUpdateSchema = <T extends CardTypes>(
  card: T,
  remove: boolean
) => void;

interface DisplayPublicCardModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  card: PublicCardSchema;
}

const DisplayPublicCardModal: React.FC<DisplayPublicCardModalProps> = ({
  setIsOpen,
  isOpen,
  card,
}) => {
  const isMcq = card?.category === "Mcq";

  if (card == null) {
    return <Loading />;
  }

  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        className={
          "mx-auto max-h-[90vh]  rounded-[20px] py-[30px] sm:px-14 lg:w-[50vw]"
        }>
        <div className={" flex items-center justify-between"}>
          <div className={"w-full sm:px-5"}>
            <div className='mb-[20px] flex items-center justify-between'>
              <div className='relative font-semibold text-tolopea dark:text-white sm:text-2xl'></div>
            </div>
            {/* Front */}
            <div className='w-full pb-4'>
              <div className={"relative mb-[36px] "}>
                <FrontBackTag label='Front' />

                <FrontCardHeader
                  type={"card-modal"}
                  text={card?.term ?? "Content not found"}
                />
              </div>
              {isMcq ? (
                <div className={"relative w-full"}>
                  <FrontBackTag label='Front' />

                  <>
                    <McqOption
                      index={0}
                      answerGiven={""}
                      mcqOptionText={card.content ?? "Content not found"}
                      correctAnswer={""}
                      isAnswered={false}
                      type={"card-modal"}
                    />
                    <McqOption
                      index={0}
                      answerGiven={""}
                      mcqOptionText={card.boc2 ?? "Content not found"}
                      correctAnswer={""}
                      isAnswered={false}
                      type={"card-modal"}
                    />
                    <McqOption
                      index={0}
                      answerGiven={""}
                      mcqOptionText={card.boc3 ?? "Content not found"}
                      correctAnswer={""}
                      isAnswered={false}
                      type={"card-modal"}
                    />
                    <McqOption
                      index={0}
                      answerGiven={""}
                      mcqOptionText={card.boc4 ?? "Content not found"}
                      correctAnswer={""}
                      isAnswered={false}
                      type={"card-modal"}
                    />
                  </>
                </div>
              ) : (
                <div className='relative'>
                  <FrontBackTag label='Back' />{" "}
                  <BackCardDefinition
                    text={card.content ?? "Content not found"}
                    type='card-modal'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export { DisplayPublicCardModal };
