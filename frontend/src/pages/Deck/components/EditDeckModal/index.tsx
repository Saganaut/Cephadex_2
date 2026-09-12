import DeleteIconRed from "@assets/cardMenuIcons/DeleteIconRed.svg?react";
import DeckIcon from "@assets/DeckIcon.svg?react";
import { InputField } from "@common/Form/InputField";
import { BottomModalWrapper } from "@common/Modals/BottomModalWrapper";
import { type DeckSchema } from "@source/client";
import { AvatarWithDefault } from "@source/common/AvatarWithDefault";
import { CustomErrorMessage } from "@source/common/Form/CustomErrorMessage";
import { SwitchField } from "@source/common/Form/SwitchField";
import { TextAreaField } from "@source/common/Form/TextAreaField";
import { Tooltip } from "@source/common/Form/Tooltip";
import { ErrorMessage } from "@source/common/InfoComponents/ErrorMessage";
import { FileUploadModal } from "@source/common/Modals/FileUploadModal";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import { useAppDispatch } from "@source/lib/store/hooks";
import { deleteDeckImg, updateOneDeck } from "@store/decks/actions";
import { Form, Formik } from "formik";
import React, { useState } from "react";

import { EditDeckFormValidation } from "./data/EditDeckFormValidation";

const processData = (values: {
  [x: string]: any;
  name?: string;
  img?: any;
  description?: any;
  category?: string;
  subject?: string;
  topic?: string;
  public?: boolean;
  tags?: string;
}): { data: string; file: File } => {
  const { img, ...otherFields } = values;
  const dataString = JSON.stringify(otherFields);
  const bodyExtract = {
    data: dataString,

    file: img,
  };
  return bodyExtract;
};

interface EditDeckModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  deck: DeckSchema;
}

const EditDeckModal: React.FC<EditDeckModalProps> = ({
  setIsOpen,
  isOpen,
  deck,
}) => {
  const dispatch = useAppDispatch();
  const [uploadImgOpen, setUploadImgOpen] = useState(false);
  const { setDeckId, setIsDeleteDeckModalOpen } = useDeckContexts();

  const handleDeleteDeck = (): void => {
    setDeckId(deck.id);
    setIsDeleteDeckModalOpen(true);
  };

  const handlePicDeletion = async (): Promise<void> => {
    void dispatch(deleteDeckImg(deck.id));
  };

  const handleEditDeck = (values: any): void => {
    void dispatch(updateOneDeck({ body: values, deckId: deck.id }));
  };
  // necessary to ensure that when the state gets updated and the modal gets re-rendered the deck name doesnt end up as an empty string
  // useEffect(() => {
  //   setNewDeckName(deck.name);
  // }, [deck.name]);
  if (deck == null) return <ErrorMessage />;

  return (
    <div>
      <BottomModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div
          className={
            "mx-auto mt-0 w-full rounded-2xl px-9 sm:mt-[64px] sm:px-20"
          }
        >
          <Formik
            initialValues={{
              name: deck.name,
              description: deck.description ?? "",
              subject: deck.subject ?? "",
              topic: deck.topic ?? "",
              tags: deck.tags ?? "",
              public: !!deck.public,
              img: null as File | null,
            }}
            validationSchema={EditDeckFormValidation}
            onSubmit={(values) => {
              const newValues = processData(values);
              handleEditDeck(newValues);
              setIsOpen(false);

              // const newValues = processData(values);
              // handleSubmit(newValues);
            }}
          >
            {(formik) => (
              <>
                <AvatarWithDefault
                  isMobile
                  image={deck.img}
                  setUploadImgOpen={setUploadImgOpen}
                  DefaultIcon={
                    <DeckIcon
                      className={
                        "h-[150px] w-[150px] rounded-xl sm:h-[260px] sm:w-[260px]"
                      }
                    />
                  }
                />
                <FileUploadModal
                  isOpen={uploadImgOpen}
                  setIsOpen={setUploadImgOpen}
                  image={deck.img}
                  formik={formik}
                  handlePicDeletion={handlePicDeletion}
                  name="img"
                />

                <Form>
                  <div className="flex sm:gap-20">
                    <div className="w-full sm:w-3/4">
                      <div className={"w-full flex-col "}>
                        <div className="py-1">
                          <InputField
                            name="name"
                            label="Name"
                            placeholder={deck.name}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            type="text"
                          />
                          <CustomErrorMessage name="name" />
                        </div>
                        <div className="py-1">
                          <TextAreaField
                            value={formik.values.description}
                            name="description"
                            label="Description"
                            placeholder={""}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />
                          <CustomErrorMessage name="description" />
                        </div>
                      </div>
                      <div
                        className={
                          "w-full items-center justify-between gap-2 sm:flex "
                        }
                      >
                        <div>
                          <InputField
                            name="subject"
                            label="Subject"
                            placeholder={deck.subject ?? "None"}
                            onBlur={formik.handleBlur}
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            type="text"
                          />
                          <CustomErrorMessage name="subject" />
                        </div>
                        <div>
                          <InputField
                            name="topic"
                            label="Topic"
                            placeholder={deck.topic ?? "None"}
                            onBlur={formik.handleBlur}
                            value={formik.values.topic}
                            onChange={formik.handleChange}
                            type="text"
                          />
                          <CustomErrorMessage name="topic" />
                        </div>
                        <div>
                          <InputField
                            name="tags"
                            label="Tags"
                            placeholder={deck.tags ?? "None"}
                            onBlur={formik.handleBlur}
                            value={formik.values.tags}
                            onChange={formik.handleChange}
                            type="text"
                          />
                          <CustomErrorMessage name="tags" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between py-4 sm:items-center">
                          <Tooltip text="Make it available to everyone">
                            <div className="mb-24 flex justify-start sm:mb-0">
                              <h5 className="self-center pr-2 text-xl">
                                Public
                              </h5>
                              <SwitchField
                                enabled={formik.values.public}
                                setEnabled={(value: boolean) => {
                                  void formik.setFieldValue("public", value);
                                }}
                              />
                            </div>
                          </Tooltip>
                          <div className="flex sm:items-center sm:gap-2 md:gap-10">
                            <div className="justify-end">
                              <button
                                className="flex items-center text-red-500"
                                type="button"
                                onClick={handleDeleteDeck}
                              >
                                <DeleteIconRed className="mr-2 h-4 w-4 text-red-500" />
                                <div className="lg:text-xl">Delete deck</div>
                              </button>
                            </div>
                            <div className="hidden justify-end sm:block">
                              <button
                                className="w-32 rounded-full bg-blaze-orange px-2 py-1 text-lg font-medium"
                                type="submit"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                      <AvatarWithDefault
                        image={formik.values?.img ? URL.createObjectURL(formik.values?.img) : deck.img}
                        setUploadImgOpen={setUploadImgOpen}
                        filename={formik.values?.img?.name}
                        DefaultIcon={
                          <DeckIcon
                            className={
                              "h-[150px] w-[150px] rounded-xl sm:h-[260px] sm:w-[260px]"
                            }
                          />
                        }
                      />
                     
                     
                  </div>

                  <div className="absolute bottom-[-1px] left-0 flex h-[100px] w-screen items-center justify-center rounded-t-2xl border-t-2 border-white/40 bg-tolopea sm:hidden">
                    <div>
                      <button
                        className="h-10 w-36 rounded-full px-2 py-1"
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="h-10 w-36 rounded-full bg-blaze-orange px-2 py-1"
                        type="submit"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </BottomModalWrapper>
    </div>
  );
};
export { EditDeckModal };
