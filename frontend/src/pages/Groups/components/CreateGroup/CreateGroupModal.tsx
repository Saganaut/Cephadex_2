import CloseIcon from "@assets/CloseIcon.svg?react";
import { InputField } from "@common/Form/InputField";
import { ModalWrapper } from "@common/Modals/ModalWrapper";
import { Button } from "@source/common/Buttons/Button";
import { CustomErrorMessage } from "@source/common/Form/CustomErrorMessage";
import { InputErrorMessageGroup } from "@source/common/Form/InputErrorMessageGroup";
import { SwitchField } from "@source/common/Form/SwitchField";
import { createNewGroup } from "@source/lib/store/groups/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { CreateGroupFormValidation } from "./data/CreateGroupFormValidation";
import {
  descriptionPlaceholders,
  groupTypePlaceholders,
  namePlaceholders,
} from "./data/CreateGroupPlaceholders";

interface CreateGroupModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [groupCreated, setGroupCreated] = useState(false);
  const dispatch = useAppDispatch();
  const [newGroupName, setNewGroupName] = useState("");
  const descriptionPlaceholder =
    descriptionPlaceholders[
      Math.floor(Math.random() * descriptionPlaceholders.length)
    ];
  const namePlaceholder =
    namePlaceholders[Math.floor(Math.random() * namePlaceholders.length)];

  const groupTypePlaceholder =
    groupTypePlaceholders[
      Math.floor(Math.random() * groupTypePlaceholders.length)
    ];

  const createGroup = (values): void => {
    void dispatch(createNewGroup(values));
    setGroupCreated(true);
    setNewGroupName(values.name);
  };

  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="xs:px-[10px] bg-grey  relative rounded-xl bg-white dark:bg-tolopea sm:px-[60px] sm:py-[50px]">
        {/* <CloseIcon
          onClick={() => {
            setIsOpen(false);
          }}
          className="absolute right-4 top-4 h-[18px] w-[18px] cursor-pointer  fill-gray-500 hover:scale-105 hover:fill-white"
        /> */}
        {groupCreated ? (
          <div className="">
            <p className="text-lg font-semibold text-tolopea dark:text-aquamarine">
              Group {newGroupName}{" "}
              <span className={"dark:text-white"}>created!</span>
            </p>
            <p className="text-lg font-semibold dark:text-white">
              Would you like to create another group?
            </p>
            <div className={"mt-[38px]"}>
              <Button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="dark:bg-transparent mx-1 bg-electric-violet-200"
                label={"No"}
              />
              <Button
                onClick={() => {
                  setGroupCreated(false);
                }}
                label={"Create"}
                className="mx-1"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="flex justify-center text-tolopea dark:text-aquamarine">
                New group
              </div>
            </div>
            <Formik
              initialValues={{
                description: "",
                groupType: "",
                name: "",
                private: false,
              }}
              validationSchema={CreateGroupFormValidation}
              onSubmit={(values) => {
                createGroup(values);

                // const newValues = processData(values);
                // handleSubmit(newValues);
              }}
            >
              {(formik) => (
                <Form className={"lg:w-[40vw]"}>
                  <div className=" mt-2 text-blaze-orange">
                    <div className="py-1">
                      <InputField
                        dashed
                        name="name"
                        label="Name"
                        placeholder={namePlaceholder.label}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        type="text"
                      />
                      <CustomErrorMessage name="name" />
                    </div>
                    <div className="py-1">
                      <InputField
                        dashed
                        name="groupType"
                        label="Type"
                        placeholder={groupTypePlaceholder.label}
                        onBlur={formik.handleBlur}
                        value={formik.values.groupType}
                        onChange={formik.handleChange}
                        type="text"
                      />
                      <CustomErrorMessage name="groupType" />
                    </div>
                    <div className="py-1">
                      <p
                        className={
                          "text:blaze-orange mb-[12px] w-fit rounded-full bg-mariana-blue-100  px-[32px] py-[4px] text-lg dark:text-white"
                        }
                      >
                        Description
                      </p>
                      <TextareaAutosize
                        minRows={1}
                        maxRows={3}
                        placeholder={descriptionPlaceholder.label}
                        name={"description"}
                        id={"content"}
                        className={
                          "max-h-[250px] min-h-[50px] w-full overflow-hidden rounded-[15px_15px_0px_15px] border-2 border-dashed border-electric-violet px-[32px] py-2 text-center text-[18px] dark:bg-tolopea dark:text-white"
                        }
                        onChange={formik.handleChange}
                        value={formik.values.description}
                      />
                    </div>
                    <CustomErrorMessage name="description" />
                  </div>
                  <div className="mt-[32px] flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="flex items-center gap-x-[16px] p-2 sm:justify-end">
                      <h5 className="pr-2 text-lg text-tolopea dark:text-white">
                        Private
                      </h5>
                      <SwitchField
                        enabled={formik.values.private}
                        setEnabled={(value: boolean) => {
                          void formik.setFieldValue("private", value);
                        }}
                      />
                    </div>
                    <div className="flex w-full items-center justify-end gap-x-[16px] p-2 sm:w-auto sm:gap-x-[8px]">
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          formik.resetForm();
                        }}
                        className={"bg-transparent"}
                        label={"cancel"}
                      />
                      <Button
                        onClick={() => {
                          formik.handleSubmit();
                        }}
                        label={"Create"}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export { CreateGroupModal };
