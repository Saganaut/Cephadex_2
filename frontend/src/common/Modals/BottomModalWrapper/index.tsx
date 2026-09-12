import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface BottomModalWrapperProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  bgColor?: string;
  onModalClose?: () => void;
}
const BottomModalWrapper: React.FC<BottomModalWrapperProps> = ({
  setIsOpen,
  isOpen,
  children,
  bgColor,
  onModalClose,
}) => {
  const handleOnClose = (): void => {
    if (onModalClose != null) {
      onModalClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={handleOnClose}
        className="relative z-[260] "
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className=" fixed inset-0 z-[200] cursor-pointer bg-black/80" />
        </Transition.Child>
        <div className="fixed bottom-0 z-[250] h-screen w-screen sm:h-[70vh]">
          <div className="relative flex h-screen min-h-full w-full dark:text-white text-tolopea text-center sm:h-[70vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-full"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-full"
            >
              <Dialog.Panel
                className={twMerge(
                  "w-full overflow-auto rounded-t-2xl text-left align-middle transition-all  custom-scrollbar border-t-2 border-white/40",
                  bgColor ?? "dark:bg-mariana-blue bg-white"
                )}
              >
                <div
                  onClick={() => {
                    setIsOpen(false);
                    handleOnClose();
                  }}
                  className="absolute right-[20px] top-[20px] hidden h-[36px] w-[36px] cursor-pointer  items-center justify-center rounded-full bg-tolopea hover:dark:bg-blaze-orange sm:flex"
                >
                  <XMarkIcon className={"h-[24px] w-[24px] text-white"} />
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export { BottomModalWrapper };
