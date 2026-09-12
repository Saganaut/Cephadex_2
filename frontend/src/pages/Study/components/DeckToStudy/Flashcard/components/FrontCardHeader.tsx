import FullMarkDown from "@source/common/FullMarkDown";
import { ExpandContentModal } from "@source/common/Modals/ExpandContentModal/ExpandContentModal";
import React from "react";

interface FrontCardHeaderProps {
  text: string;
  type?: "card-modal" | "study";
}

const FrontCardHeader: React.FC<FrontCardHeaderProps> = ({
  text,
  type = "study",
}) => {
  const [expandModalIsOpen, setExpandModalIsOpen] = React.useState(false);
  const studyClass =
    "mb-[20px] block w-full rounded-[12px] px-2 md:p-[12px]  text-xl font-medium text-tolopea dark:text-white lg:hidden cursor-pointer";
  const modalClass = `max-h-[160px] w-full overflow-auto rounded-3xl  bg-transparent px-4 sm:px-8 py-2 text-sm sm:text-2xl  text-tolopea/80 font-medium dark:text-electric-violet-200 cursor-pointer`;

  const classToUse = type === "study" ? studyClass : modalClass;
  return (
    <>
      <div
        className={classToUse}
        onClick={() => {
          setExpandModalIsOpen(!expandModalIsOpen);
        }}>
        <FullMarkDown content={text} />
      </div>
      <ExpandContentModal
        content={text}
        isOpen={expandModalIsOpen}
        setIsOpen={() => {
          setExpandModalIsOpen(!expandModalIsOpen);
        }}
      />
    </>
  );
};

export { FrontCardHeader };
