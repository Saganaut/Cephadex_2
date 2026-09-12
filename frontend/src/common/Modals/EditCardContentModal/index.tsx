/** Edit Card Modal
 *
 * This modal is used in Decks, Study Quiz, or anywhere else where a card can be pulled up
 *
 *
 *
 * TODO:
 * - Improve the position of the edits button for front and back
 **/

import { CTA } from "@common/Modals/EditCardContentModal/CTA";
import { DefinitionBack } from "@common/Modals/EditCardContentModal/DefinitionBack";
import { MCQBack } from "@common/Modals/EditCardContentModal/MCQBack";
import { ModalWrapper } from "@common/Modals/ModalWrapper";
import { XCircleIcon } from "@heroicons/react/20/solid";
import type { CardSchema, StudyCardSchema } from "@source/client";
import { EditButton } from "@source/common/Buttons/IconButtons/EditButton";
import { InputErrorMessageGroup } from "@source/common/Form/InputErrorMessageGroup";
import { Loading } from "@source/common/InfoComponents/Loading";
import { FrontEditable } from "@source/common/Modals/EditCardContentModal/FrontEditable";
import { McqOption } from "@source/common/Questions/Mcq/McqOption";
import type { TempQuestionSchema } from "@source/lib/store/tempQuestions/tempQuestionsSlice";
import { truncate } from "@source/lib/utils/functions";
import { BackCardDefinition } from "@source/pages/Study/components/DeckToStudy/Flashcard/components/BackCardDefinition";
import { FrontCardHeader } from "@source/pages/Study/components/DeckToStudy/Flashcard/components/FrontCardHeader";
import { Form, Formik } from "formik";
import React from "react";

import { FrontBackTag } from "./components/FrontBackTag";
import useEditCardContent, { HandleUpdateSchema } from "./useEditCardContent";

interface EditCardContentModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeCard: CardSchema | StudyCardSchema | TempQuestionSchema | null;
  deckId: string;
  type: "Quiz" | "Study" | "Cards";
  //   isCreate: boolean;
  handleUpdateSchema?: HandleUpdateSchema;
  newOrEdit?: "new" | "edit";
}

const EditCardContentModal: React.FC<EditCardContentModalProps> = ({
  setIsOpen,
  isOpen,
  activeCard,
  deckId,
  newOrEdit = "edit",
  type,
  handleUpdateSchema,
}) => {
  const {
    initialValues,
    validationSchema,
    handleCardUpdate,
    setOldValues,
    newCardCreated,
    editingBack,
    editingFront,
    newCardTerm,
    changedValues,
    setEditingBack,
    setNewCardCreated,
    setNewCardTerm,
    setEditingFront,
    isMcq,
    status,
  } = useEditCardContent({
    activeCard,
    isOpen,
    type,
    deckId,
    handleUpdateSchema,
  });

  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      {status === "loading" ? (
        <div className='p-5'>
          <Loading />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleCardUpdate(values);
            setOldValues(initialValues);
          }}>
          {(props) => (
            <div
              className={
                "mx-auto max-h-[90vh] rounded-[20px] px-2 py-[30px] sm:px-14 lg:max-w-[800px]"
              }>
              <Form
                className={"flex size-full flex-col justify-between sm:px-5"}>
                <div className='mb-[20px] flex items-center justify-between'>
                  <div className='relative font-semibold text-tolopea dark:text-white sm:text-2xl'>
                    <div className='flex items-center justify-center transition-opacity duration-500'>
                      {" "}
                      <span
                        className={`flex justify-start whitespace-nowrap transition-opacity duration-500 ${
                          newCardCreated
                            ? "invisible opacity-0"
                            : !editingFront && !editingBack
                              ? "invisible opacity-0"
                              : "visible opacity-100"
                        }`}>
                        Editing...
                      </span>
                      <span
                        className={`font-medium transition-opacity duration-500 dark:text-blaze-orange ${
                          newCardCreated
                            ? "visible opacity-100"
                            : "invisible opacity-0"
                        }`}>
                        {truncate(newCardTerm, 10)} card edited!
                      </span>
                    </div>
                  </div>
                </div>
                {/* Front */}
                <div className='w-full pb-4'>
                  <div className={"relative mb-[36px] "}>
                    <FrontBackTag label='Front' />

                    {editingFront ? (
                      <FrontEditable
                        status={status}
                        formik={props}
                        changedValues={changedValues}
                      />
                    ) : (
                      <FrontCardHeader
                        type={"card-modal"}
                        text={initialValues.term}
                      />
                    )}
                    <div className='absolute bottom-0  right-0'>
                      {editingFront ? (
                        <XCircleIcon
                          onClick={() => {
                            setEditingFront(!editingFront);
                          }}
                          className={`size-[35px] text-black dark:text-aquamarine `}
                          aria-hidden='true'
                        />
                      ) : (
                        <EditButton
                          onClick={() => {
                            setEditingFront(!editingFront);
                          }}
                          style={"shallows"}
                        />
                      )}
                    </div>
                  </div>
                  {isMcq ? (
                    <div className={"relative w-full"}>
                      <FrontBackTag label='Front' />

                      {editingBack ? (
                        <div className=''>
                          <MCQBack
                            status={status}
                            formik={props}
                            name={"content"}
                            changedValues={changedValues}
                            index={0}
                            type={type}
                          />
                          <MCQBack
                            status={status}
                            formik={props}
                            name={"boc2"}
                            changedValues={changedValues}
                            index={1}
                            type={type}
                          />
                          <MCQBack
                            status={status}
                            formik={props}
                            name={"boc3"}
                            changedValues={changedValues}
                            index={2}
                            type={type}
                          />
                          <MCQBack
                            status={status}
                            formik={props}
                            name={"boc4"}
                            changedValues={changedValues}
                            index={3}
                            type={type}
                          />
                        </div>
                      ) : (
                        <>
                          <McqOption
                            index={0}
                            answerGiven={initialValues.content}
                            mcqOptionText={initialValues.content}
                            correctAnswer={initialValues.content}
                            isAnswered={false}
                            type={"card-modal"}
                          />
                          <McqOption
                            index={0}
                            answerGiven={initialValues.content}
                            mcqOptionText={initialValues.boc2}
                            correctAnswer={initialValues.content}
                            isAnswered={false}
                            type={"card-modal"}
                          />
                          <McqOption
                            index={0}
                            answerGiven={initialValues.content}
                            mcqOptionText={initialValues.boc3}
                            correctAnswer={initialValues.content}
                            isAnswered={false}
                            type={"card-modal"}
                          />
                          <McqOption
                            index={0}
                            answerGiven={initialValues.content}
                            mcqOptionText={initialValues.boc4}
                            correctAnswer={initialValues.content}
                            isAnswered={false}
                            type={"card-modal"}
                          />
                        </>
                      )}
                      <div className='absolute bottom-[-20px] right-0 z-20'>
                        {editingBack ? (
                          <XCircleIcon
                            onClick={() => {
                              setEditingBack(!editingBack);
                            }}
                            className={`size-[35px] text-black dark:text-aquamarine `}
                            aria-hidden='true'
                          />
                        ) : (
                          <EditButton
                            onClick={() => {
                              setEditingBack(!editingBack);
                            }}
                            style={"shallows"}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='relative'>
                      <FrontBackTag label='Back' />
                      {editingBack ? (
                        <DefinitionBack
                          status={status}
                          formik={props}
                          changedValues={changedValues}
                        />
                      ) : (
                        <>
                          {" "}
                          <BackCardDefinition
                            text={initialValues.content}
                            type='card-modal'
                          />
                        </>
                      )}
                      <div className='absolute bottom-[-20px] right-0 z-20'>
                        <EditButton
                          onClick={() => {
                            setEditingBack(!editingBack);
                          }}
                          style={"shallows"}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {Object.keys(props.errors).length > 0 && (
                  <InputErrorMessageGroup
                    errors={props.errors}
                    touched={props.touched}
                  />
                )}

                {/* {status === null && ( */}
                <div className=' sm:static sm:w-auto'>
                  <CTA
                    formik={props}
                    deckId={Number(deckId)}
                    cardId={activeCard?.id}
                    type={newOrEdit}
                    contentType={type}
                    setEditCardModalIsOpen={setIsOpen}
                    setNewCardCreated={setNewCardCreated}
                    setNewCardTerm={setNewCardTerm}
                  />
                </div>
                {/* )} */}
              </Form>
            </div>
          )}
        </Formik>
      )}
    </ModalWrapper>
  );
};

export { EditCardContentModal };
