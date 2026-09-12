import { ModalWrapper } from "@common/Modals/ModalWrapper";
import { CardTypeSelector } from "@source/common/Form/CardTypeSelector";
import { InputErrorMessageGroup } from "@source/common/Form/InputErrorMessageGroup";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import { selectDeckById } from "@source/lib/store/decks/decksSlice";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { createOneCard } from "@store/cards/actions";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";

import { cardTypes } from "../../Form/CardTypeSelector/cardTypes";
import { FrontBackTag } from "../EditCardContentModal/components/FrontBackTag";
import { CTA } from "../EditCardContentModal/CTA";
import { DefinitionBack } from "../EditCardContentModal/DefinitionBack";
import { FrontEditable } from "../EditCardContentModal/FrontEditable";
import { MCQBack } from "../EditCardContentModal/MCQBack";
import { NewCardFormValidation } from "./data/NewCardFormValidation";
import { processCardData } from "./functions";

export interface NewCardFormValues {
  term: string;
  content: string;
  boc2: string;
  boc3: string;
  boc4: string;
  category: string;
  formula: string | null;
  subject: string | null;
  topic: string | null;
}

const NewCardModal: React.FC = () => {
  const { newCardModalIsOpen, setNewCardModalIsOpen, deckId } =
    useDeckContexts();
  const slicedCardTypes = cardTypes.slice(1);
  const dispatch = useAppDispatch();
  const deck = useAppSelector((state) => selectDeckById(state, deckId));
  const status = null;
  const [newCardCreated, setNewCardCreated] = React.useState(false);
  const [newCardTerm, setNewCardTerm] = React.useState("");

  function getCardLabels(category: string): {
    frontLabel: string;
    backLabel: string;
  } {
    switch (category) {
      case "Definitions":
        return { frontLabel: "Title", backLabel: "Description" };
      case "Multiple choice":
        return { frontLabel: "Question", backLabel: "Answer" };
      case "Translate":
        return { frontLabel: "Word", backLabel: "Translation" };
      case "Fill in the blanks":
        return {
          frontLabel: "Sentence",
          backLabel: "Missing words",
        };

      default:
        return { frontLabel: "Front", backLabel: "Back" };
    }
  }

  const handleCardCreate = (values: any): void => {
    const processedValues = processCardData(values);
    const existingDeckId = Number(deck?.id);
    void dispatch(
      createOneCard({
        deckId: existingDeckId,
        cardData: processedValues,
      })
    );
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (newCardCreated) {
      timeoutId = setTimeout(() => {
        setNewCardCreated(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [newCardCreated]);

  if (deck === undefined) {
    return;
  }

  return (
    <>
      <ModalWrapper
        isOpen={newCardModalIsOpen}
        setIsOpen={setNewCardModalIsOpen}>
        {/* Form */}

        <Formik
          initialValues={{
            term: "",
            content: "",
            boc2: "",
            boc3: "",
            boc4: "",
            category: "Definitions",
            formula: "",
            subject: deck.subject,
            topic: deck.topic,
          }}
          validateOnChange={false} // stop the form from validating before submitting
          validateOnBlur={false} // stop the form from validating before submitting
          validationSchema={NewCardFormValidation}
          onSubmit={(values, { resetForm }) => {
            handleCardCreate(values);
            setNewCardCreated(true);
            setNewCardTerm(values.term);
            resetForm();
          }}>
          {(formik) => {
            const { frontLabel, backLabel } = getCardLabels(
              formik.values.category
            );

            return (
              <>
                <div
                  className={
                    "mx-auto max-h-[90vh] w-[90vw] overflow-y-auto rounded-[20px] py-[30px] sm:px-14 lg:w-[50vw]"
                  }>
                  <div className={" flex items-center justify-between"}>
                    <Form className={"w-full sm:px-5"}>
                      <div
                        className={
                          "mb-[20px] flex items-center justify-between"
                        }>
                        <div className='relative font-semibold text-tolopea dark:text-white sm:text-2xl'>
                          {newCardCreated && (
                            <div
                              className='absolute inset-0 flex items-center justify-center transition-opacity duration-500'
                              style={{
                                opacity: newCardCreated ? 1 : 0,
                              }}>
                              <p className=' font-medium dark:text-blaze-orange'>
                                {newCardTerm}
                                card created!
                              </p>
                            </div>
                          )}
                          <h1
                            className={`transition-opacity duration-500 ${
                              newCardCreated ? "opacity-0" : "opacity-100"
                            }`}>
                            Create a card: {formik.values.category}
                          </h1>
                        </div>
                      </div>
                      <div className='mb-6 hidden shrink sm:flex'>
                        <CardTypeSelector
                          name='category'
                          card={formik.values.category}
                          onChange={(value) => {
                            void formik.setFieldValue("category", value);
                          }}
                          onBlur={formik.handleBlur}
                          size='small'
                          cardTypes={slicedCardTypes}
                        />
                      </div>
                      <div className='w-full py-4'>
                        <div className={"mb-[36px]"}>
                          <FrontBackTag label='Front' />

                          <FrontEditable
                            status={null}
                            formik={formik}
                            type='new'
                            error={
                              (formik.errors.term?.length ?? 0) > 0 &&
                              formik.touched.term
                            }
                          />
                        </div>
                        <FrontBackTag label='Back' />

                        {formik.values.category === "Multiple choice" ? (
                          <div>
                            <MCQBack
                              status={status}
                              formik={formik}
                              name={"content"}
                              editType='new'
                              type='Cards'
                              index={0}
                              label={"Correct"}
                              error={
                                (formik.errors.content?.length ?? 0) > 0 &&
                                formik.touched.content
                              }
                            />
                            <MCQBack
                              status={status}
                              formik={formik}
                              name={"boc2"}
                              editType='new'
                              type='Cards'
                              index={1}
                              label={"Wrong"}
                              error={
                                (formik.errors.boc2?.length ?? 0) > 0 &&
                                formik.touched.boc2
                              }
                            />
                            <MCQBack
                              status={status}
                              formik={formik}
                              name={"boc3"}
                              editType='new'
                              type='Cards'
                              index={2}
                              label={"Wrong"}
                              error={
                                (formik.errors.boc3?.length ?? 0) > 0 &&
                                formik.touched.boc3
                              }
                            />
                            <MCQBack
                              status={status}
                              formik={formik}
                              name={"boc4"}
                              editType='new'
                              type='Cards'
                              index={3}
                              label={"Wrong"}
                              error={
                                (formik.errors.boc4?.length ?? 0) > 0 &&
                                formik.touched.boc4
                              }
                            />
                          </div>
                        ) : (
                          <DefinitionBack
                            status={null}
                            formik={formik}
                            type='new'
                            error={
                              (formik.errors.content?.length ?? 0) > 0 &&
                              formik.touched.content
                            }
                          />
                        )}
                      </div>

                      {Object.keys(formik.errors).length > 0 && (
                        <InputErrorMessageGroup
                          errors={formik.errors}
                          touched={formik.touched}
                        />
                      )}
                      <div className='w-full sm:hidden'>
                        <CardTypeSelector
                          name='category'
                          card={formik.values.category}
                          onChange={(value) => {
                            void formik.setFieldValue("category", value);
                          }}
                          onBlur={formik.handleBlur}
                          size='small'
                          cardTypes={slicedCardTypes}
                        />
                      </div>
                      <div className='absolute left-0 w-screen sm:static sm:w-auto'>
                        <CTA
                          formik={formik}
                          deckId={deckId}
                          type='new'
                          onClose={() => {
                            setNewCardModalIsOpen(false);
                          }}
                          setNewCardTerm={setNewCardTerm}
                          setNewCardCreated={setNewCardCreated}
                        />
                      </div>
                    </Form>
                  </div>
                </div>
              </>
            );
          }}
        </Formik>
      </ModalWrapper>
    </>
  );
};

export { NewCardModal };
