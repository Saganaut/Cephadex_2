import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { type FormikProps } from "formik";
import React, { type FC, Fragment } from "react";

import { FileInputField } from "../Form/FileInputField";

const FileUploadModal: FC<{
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  image: string | null;
  handlePicDeletion: () => void;
  formik: FormikProps<any>;
  name: string;
}> = ({ isOpen, setIsOpen, image, handlePicDeletion, formik, name }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="mb-5 w-[360px] rounded-lg bg-mariana-blue-100 text-base">
              <FileInputField formik={formik} name={name} />
              {image != null && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePicDeletion();
                    setIsOpen(false);
                  }}
                  className="flex w-full gap-2 border-t border-mariana-blue px-4 py-5"
                >
                  <DeleteIcon className="h-5 w-5" />
                  Delete..
                </button>
              )}
            </div>
            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-mariana-blue">
              <XMarkIcon
                className="h-8 w-8"
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export { FileUploadModal };
