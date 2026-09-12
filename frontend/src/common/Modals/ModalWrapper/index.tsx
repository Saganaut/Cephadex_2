import CloseIcon from "@assets/CloseIcon.svg?react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";

interface ModalWrapperProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  bgColor?: string;
}
const ModalWrapper: React.FC<ModalWrapperProps> = ({
  setIsOpen,
  isOpen,
  children,
  bgColor,
}) => {
  const bgColorClass = bgColor ?? "dark:bg-tolopea bg-white";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as={"div"}
        className={
          "fixed inset-0 z-[500] flex h-screen w-full  items-center justify-center overflow-y-auto "
        }
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black/80' />
        </Transition.Child>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex h-full items-center justify-center text-center sm:p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              {/* <Dialog.Panel
                className={
                  " flex items-center justify-center rounded-[18px] bg-tolopea"
                }
              >
                <div
                  className={
                    "mx-auto flex h-[100vh] w-[100vw] items-center justify-center sm:h-full sm:w-full"
                  }
                >
                  {children}
                </div>
              </Dialog.Panel> */}
              <Dialog.Panel
                className={`relative flex h-full flex-col items-center justify-between sm:rounded-[18px] ${bgColorClass} sm:h-auto sm:flex-row sm:justify-center`}>
                <CloseIcon
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className={
                    "absolute right-[20px] top-[20px] z-[9999] hidden size-[14px] cursor-pointer fill-gray-500 hover:fill-tolopea hover:text-white hover:dark:fill-white sm:block"
                  }
                />
                <div className='mx-auto flex h-screen w-screen items-center justify-center text-tolopea dark:text-white sm:size-full'>
                  {children}
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className='mb-4 flex size-11 items-center justify-center rounded-full bg-mariana-blue text-white sm:hidden'>
                  <XMarkIcon className='size-8' />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export { ModalWrapper };
