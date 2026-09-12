import { XMarkIcon } from "@heroicons/react/24/outline";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { truncate } from "@source/lib/utils/functions";
import React from "react";

interface SourceBoxProps {
  fileId: string;
  sourceContent: string;
  pages: string;
  setIsOpen: (arg0: boolean) => void;
  handleClickFile: () => void;
}

const numChars = 200;
const SourceBox: React.FC<SourceBoxProps> = ({
  fileId,
  sourceContent,
  pages,
  setIsOpen,
  handleClickFile,
}) => {
  return (
    <div className="absolute left-0 top-0   z-[100] flex w-[100vw] flex-col rounded-b-xl bg-electric-violet p-6 text-white shadow-xl sm:w-full sm:rounded-xl">
      <div className="flex justify-between">
        <p className="relative mb-4 text-left text-sm">Excerpt from source:</p>
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          className=" flex h-[26px] w-[26px] cursor-pointer  items-center justify-center rounded-full bg-tolopea/50 dark:hover:bg-tolopea/20 sm:flex"
        >
          <XMarkIcon className={"h-[24px] w-[24px] text-white"} />
        </div>
      </div>
      <p className="mb-2 flex-1 text-left text-sm text-white/90">
        {truncate(sourceContent, numChars)}
      </p>
      <p className="mb-4 text-right text-xs text-white/70">Pages: {pages}</p>

      <StyledButton
        label="View Source"
        style="outline"
        size="small"
        onClick={() => {
          handleClickFile();
        }}
      />
    </div>
  );
};

export { SourceBox };
