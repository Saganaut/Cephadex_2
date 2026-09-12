import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import CloseIcon from "@assets/CloseIcon.svg?react";
import { AccountService } from "@client/services/AccountService";
import { FileInputField } from "@source/common/Form/FileInputField";
import { InputErrorMessageGroup } from "@source/common/Form/InputErrorMessageGroup";
import { UploadPicFormValidation } from "@source/common/Modals/UploadPicModal/data/UploadPicFormValidation";
import type UploadPicFormValues from "@source/common/Modals/UploadPicModal/data/UploadPicFormValues";
import { useToast } from "@source/lib/contexts/ToastContext";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/user/userSlice";
import { Form, Formik } from "formik";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";
import { DeleteButton } from "@source/common/Buttons/IconButtons/DeleteButton";

interface UploadPicModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pic: string | null | undefined;
}

const UploadPicModal: React.FC<UploadPicModalProps> = ({
  isOpen,
  setIsOpen,
  pic,
}) => {
  const dispatch = useAppDispatch();
  const { postToast } = useToast();
  const handlePicDeletion = async (): Promise<void> => {
    const response = await AccountService.deleteProfilePicture();
    if (response.user != null) {
      void dispatch(setUser(response.user));
    }
  };
  const submitFile = async (values: UploadPicFormValues): Promise<void> => {
    if (values.file != null) {
      const formData = {
        profile_pic: values.file,
      };
      const response = await AccountService.updateProfilePicture(formData);
      const frenchToast = {
        message: "Profile picture updated",
        title: "Success!",
      };
      postToast(frenchToast);
      if (response.user != null) {
        void dispatch(setUser(response.user));
      }
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <Formik
        initialValues={{
          file: null,
        }}
        validationSchema={UploadPicFormValidation}
        onSubmit={(values) => {
          void submitFile(values);
        }}
      >
        {(formik) => (
          <div className={" px-[62px] py-[30px]"}>
            <Form>
              <div>
                <h1 className="py-4 text-center text-2xl font-semibold ">
                  Upload a new picture
                </h1>
                {/* rest of the form */}
              </div>
              <div className="flex items-center">
                <FileInputField formik={formik} name={"file"} />
                {pic != null && (
                  // <DeleteIcon
                  //   className="ml-4 h-12 w-12 cursor-pointer"
                  //   onClick={handlePicDeletion}
                  // >
                  //   Delete picture
                  // </DeleteIcon>
                  <DeleteButton onClick={handlePicDeletion} style="depths" />
                )}
              </div>
              <div className="h-10">
                <InputErrorMessageGroup
                  errors={formik.errors}
                  touched={formik.touched}
                />
                {formik.values.file !== null &&
                  formik.values.file !== undefined &&
                  formik.errors.file == null && (
                    <button
                      className={` rounded-full bg-blaze-orange px-4 py-1 text-xl text-white`}
                      type="submit"
                      //   disabled={isDisabled}
                    >
                      Upload{" "}
                    </button>
                  )}
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </ModalWrapper>
  );
};

export { UploadPicModal };
