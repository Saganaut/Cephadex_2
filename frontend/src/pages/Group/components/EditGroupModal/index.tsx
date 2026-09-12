import DeleteIconRed from "@assets/cardMenuIcons/DeleteIconRed.svg?react";
import GroupIcon from "@assets/GroupOctopusIcon.svg?react";
import { InputField } from "@common/Form/InputField";
import { type GroupSchema } from "@source/client";
import { AvatarWithDefault } from "@source/common/AvatarWithDefault";
import { CustomErrorMessage } from "@source/common/Form/CustomErrorMessage";
import { SwitchField } from "@source/common/Form/SwitchField";
import { TextAreaField } from "@source/common/Form/TextAreaField";
import { Tooltip } from "@source/common/Form/Tooltip";
import { BottomModalWrapper } from "@source/common/Modals/BottomModalWrapper";
import { DeleteConfirmationModal } from "@source/common/Modals/DeleteConfirmationModal";
import { FileUploadModal } from "@source/common/Modals/FileUploadModal";
import { deleteGroupImg, updateGroup } from "@source/lib/store/group/actions";
import { deleteOneGroup } from "@source/lib/store/groups/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import { CreateGroupFormValidation } from "@source/pages/Groups/components/CreateGroup/data/CreateGroupFormValidation";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EditGroupModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: GroupSchema;
}

const processData = (values: {
  name?: string;
  img?: any;
  description?: string | null;
  groupType?: string | null;
  private?: boolean;
}): { request: string; file: File } => {
  const { img, groupType, ...otherFields } = values;
  const dataWithRenamedKey = { type: groupType, ...otherFields };

  const dataString = JSON.stringify(dataWithRenamedKey);
  const bodyExtract = {
    request: dataString,
    file: img,
  };

  return bodyExtract;
};

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  setIsOpen,
  group,
}) => {
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [uploadImgOpen, setUploadImgOpen] = useState(false);
  const handlePicDeletion = async (): Promise<void> => {
    void dispatch(deleteGroupImg(group.id));
  };
  const updateGroupValues = (values: any): void => {
    void dispatch(updateGroup({ groupId: group.id, body: values }));
  };

  const forRealDeleteIt = (): void => {
    void dispatch(deleteOneGroup(group.id));

    navigate("/groups");
  };
  const handleCloseModal = (): void => {
    setIsOpen(false);
    setDeleteGroup(false);
  };

  return (
    <>
      <BottomModalWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onModalClose={handleCloseModal}
      >
        <div className={"mx-auto mt-[64px] w-[80%] rounded-2xl   "}>
          {deleteGroup ? (
            <div className="mx-10">
              <div className="mb-10">
                Are you sure you want to delete this group?
              </div>
              <div className="flex gap-8">
                <button
                  onClick={() => {
                    setDeleteGroup(false);
                  }}
                  className="rounded-full border px-4 py-1 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    forRealDeleteIt();
                  }}
                  className="rounded-full bg-red-600 px-4 py-1 text-white"
                >
                  Delete group
                </button>
              </div>
            </div>
          ) : (
            <Formik
              initialValues={{
                description: group.description,
                groupType: group.groupType,
                name: group.name,
                private: !!group.isPrivate,
                img: undefined,
              }}
              validationSchema={CreateGroupFormValidation}
              onSubmit={(values) => {
                const newValues = processData(values);
                updateGroupValues(newValues);
                setIsOpen(false);
              }}
            >
              {(formik) => (
                <>
                  <AvatarWithDefault
                    isMobile
                    image={group.img}
                    setUploadImgOpen={setUploadImgOpen}
                    DefaultIcon={
                      <GroupIcon
                        className={
                          "h-[150px] w-[150px] rounded-xl sm:h-[260px] sm:w-[260px]"
                        }
                      />
                    }
                  />
                  <FileUploadModal
                    isOpen={uploadImgOpen}
                    setIsOpen={setUploadImgOpen}
                    image={group.img}
                    formik={formik}
                    handlePicDeletion={handlePicDeletion}
                    name="img"
                  />
                  <Form>
                    <div className="flex gap-20">
                      <div className="sm:w-[75%]">
                        <div className={"w-full flex-col "}>
                          <div className="py-1">
                            <div className="py-1">
                              <InputField
                                name="name"
                                label="Name"
                                placeholder={group.name}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                type="text"
                              />
                              <CustomErrorMessage name="name" />
                            </div>
                            <div className="py-1">
                              <InputField
                                name="groupType"
                                label="Type"
                                placeholder={group.groupType ?? ""}
                                onBlur={formik.handleBlur}
                                value={formik.values.groupType ?? ""}
                                onChange={formik.handleChange}
                                type="text"
                              />
                              <CustomErrorMessage name="groupType" />
                            </div>
                            <div className="py-1">
                              <TextAreaField
                                value={formik.values.description ?? ""}
                                name="description"
                                label="Description"
                                placeholder={group.description ?? ""}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                              />
                              <CustomErrorMessage name="description" />
                            </div>
                            <div>
                              <div className="flex justify-between py-4 sm:items-center">
                                <Tooltip text="Make it available only to group members">
                                  <div className="mb-24 flex justify-start sm:mb-0">
                                    <h5 className="self-center pr-2 text-xl">
                                      Private
                                    </h5>
                                    <SwitchField
                                      enabled={formik.values.private}
                                      setEnabled={(value: boolean) => {
                                        void formik.setFieldValue(
                                          "private",
                                          value
                                        );
                                      }}
                                    />
                                  </div>
                                </Tooltip>
                                <div className="flex sm:items-center sm:gap-2 md:gap-10">
                                  <div className="justify-end">
                                    <button
                                      className="flex items-center text-red-500"
                                      type="button"
                                      onClick={() => {
                                        setDeleteIsOpen(true);
                                      }}
                                    >
                                      <DeleteIconRed className="mr-2 h-4 w-4 text-red-500" />
                                      <div className="lg:text-xl">
                                        Delete group
                                      </div>
                                    </button>
                                  </div>
                                  <div className="hidden justify-end sm:block">
                                    <button
                                      className="w-32 rounded-full bg-blaze-orange px-2 py-1 text-lg font-medium"
                                      type="submit"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <AvatarWithDefault
                        image={group.img}
                        setUploadImgOpen={setUploadImgOpen}
                        DefaultIcon={
                          <GroupIcon
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
                          Submit
                        </button>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          )}
        </div>
        <DeleteConfirmationModal
          isOpen={deleteIsOpen}
          setIsOpen={setDeleteIsOpen}
          handleDelete={() => {
            forRealDeleteIt();
          }}
          title="Delete group"
          message="Are you sure you want to delete this group?"
        />
      </BottomModalWrapper>
    </>
  );
};

export { EditGroupModal };
