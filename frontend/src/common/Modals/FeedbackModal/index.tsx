import CephCircleHappy from "@assets/bubbles/CephCircleHappy.png";

import { UserService } from "@client/services/UserService";
import { Dropdown } from "@common/Form/Dropdown";
import { useFeedbackModal } from "@contexts/FeedbackContext";
import { CustomErrorMessage } from "@source/common/Form/CustomErrorMessage";
import { TextAreaField } from "@source/common/Form/TextAreaField";
import { FeedbackFormValidation } from "@source/common/Modals/FeedbackModal/data/FeedbackFormValidation";
import { useToast } from "@source/lib/contexts/ToastContext";
import { type RootState } from "@source/lib/store/store";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { ModalWrapper } from "../ModalWrapper";
import { FeedbackOptions } from "./data/FeedbackOptions";

// interface FeedbackModalProps {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   deckId: string | undefined;
// }

const FeedbackModal: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const userName = user != null ? user.firstName : "";
  const userEmail = user != null ? user.email : "";

  const [feedbackReceived, setFeedbackReceived] = useState(false);

  const { isFeedbackModalOpen, setIsFeedbackModalOpen } = useFeedbackModal();
  const getSelectedType = (
    label: string
  ): {
    value: number;
    label: string;
  } => {
    return (
      FeedbackOptions.find((type) => type.label === label) || {
        value: 0,
        label: "Bug",
      }
    );
  };

  const handleSubmit = async (values: any): Promise<void> => {
    const response = await UserService.feedback(values);
    if (response.status === "success") {
      setFeedbackReceived(true);
    }
  };

  const processData = (values: {
    messageField: string;
    feedbackTypeField: string;
    nameField: string;
    emailField: string;
  }): {
    messageField: string;
    feedbackTypeField: string;
    nameField: string;
    emailField: string;
  } => {
    const formData = {
      messageField: values.messageField,
      feedbackTypeField: values.feedbackTypeField,
      nameField: values.nameField,
      emailField: values.emailField,
    };
    return formData;
  };
  useEffect(() => {
    if (isFeedbackModalOpen) {
      setFeedbackReceived(false);
    }
  }, [isFeedbackModalOpen]);
  return (
    <>
      <ModalWrapper
        isOpen={isFeedbackModalOpen}
        setIsOpen={setIsFeedbackModalOpen}
        bgColor={"dark:bg-mariana-blue bg-electric-violet-200"}
      >
        <div className="max-w-lg rounded-xl dark:bg-mariana-blue p-4 px-8">
          {/* <CloseIcon
            onClick={() => {
              closeFeedbackModal();
            }}
            className="absolute right-4 top-4 h-6 w-6 cursor-pointer hover:scale-105"
            fill="#FF6E0B"
          /> */}

          {!feedbackReceived ? (
            <>
              <div className="flex py-4 ">
                <img src={CephCircleHappy} className="max-h-[80px]" />

                <div className=" flex items-center justify-center px-4 text-lg text-white">
                  Got some feedback?
                </div>
              </div>
              <Formik
                initialValues={{
                  messageField: "",
                  feedbackTypeField: "Bug",
                  nameField: userName,
                  emailField: userEmail,
                }}
                validationSchema={FeedbackFormValidation}
                onSubmit={(values) => {
                  const newValues = processData(values);
                  void handleSubmit(newValues);
                }}
              >
                {(formik) => (
                  <Form>
                    <div className=" mt-2 text-blaze-orange">
                      {/* <div className="py-2">
                        <InputField
                          name="nameField"
                          placeholder="name"
                          onBlur={formik.handleBlur}
                          value={formik.values.nameField}
                          onChange={formik.handleChange}
                          type="text"
                          handleOnKeyDown={undefined}
                        />
                      </div>{" "}
                      <div className="py-2">
                        <InputField
                          name="emailField"
                          placeholder="email"
                          onBlur={formik.handleBlur}
                          value={formik.values.emailField}
                          onChange={formik.handleChange}
                          type="email"
                          handleOnKeyDown={undefined}
                        />{" "}
                      </div>{" "} */}
                      <div className="py-1">
                        <Dropdown
                          name="feedbackTypeField"
                          style="sort"
                          secondStyle="shallows"
                          options={FeedbackOptions}
                          onChange={(selectedOption: { label: any }) => {
                            void formik.setFieldValue(
                              "feedbackTypeField",
                              selectedOption.label
                            );
                          }}
                          value={getSelectedType(
                            formik.values.feedbackTypeField
                          )}
                        />
                        <CustomErrorMessage name="feedbackTypeField" />
                      </div>
                      <div className="py-1">
                        <TextAreaField
                          value={formik.values.messageField}
                          name="messageField"
                          placeholder="message"
                          // label="Message in a bottle"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        />
                        <CustomErrorMessage name="messageField" />
                      </div>
                    </div>{" "}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        className="rounded-full bg-blaze-orange px-4 py-1 text-xl text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <img src={CephCircleHappy} className="max-h-[100px]" />

                <div className="   px-2">
                  <div>
                    <h4 className="text-aquamarine">
                      Thank you for your feedback!
                    </h4>

                    <p className="text-aquamarine">
                      We&apos;ll be in touch as soon as we can.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ModalWrapper>
    </>
  );
};

export { FeedbackModal };
