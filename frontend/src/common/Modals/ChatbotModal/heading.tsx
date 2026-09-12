import ChatbotIcon from "@assets/Chatbot.svg";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { type DeckFilesSchema } from "@source/client";
import { useFileContext } from "@source/lib/contexts/FileContext";
import { getOneFile } from "@source/lib/store/deckFiles/actions";
import { selectDeckFileById } from "@source/lib/store/deckFiles/deckFilesSlice";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import React, { useEffect } from "react";

import { SourceBox } from "./SourceBox";

interface ChatBotHeadingProps {
  setSourceBoxOpen: (arg0: boolean) => void;
  sourceBoxOpen: boolean;
  fileId: string;
  sourceContent?: string;
  pages?: string;
  setIsOpen: (arg0: boolean) => void;
}
const ChatBotHeading: React.FC<ChatBotHeadingProps> = ({
  setSourceBoxOpen,
  sourceBoxOpen,
  fileId,
  sourceContent,
  pages,
  setIsOpen,
}) => {
  const { setFileModalIsOpen, setFile, setDeckId } = useFileContext();
  const file = useAppSelector((state) => selectDeckFileById(state, fileId));
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (file == null && fileId !== "") {
      void dispatch(getOneFile(Number(fileId)));
    }
  }, [fileId, file, dispatch]);

  const handleClickFile = (file: DeckFilesSchema | undefined): void => {
    if (file == null) return;

    setFile(file);
    setDeckId(0);
    setFileModalIsOpen(true);
    setIsOpen(false);
    setSourceBoxOpen(false);
  };

  return (
    <>
      {" "}
      <div
        className={
          "flex items-center  justify-between rounded-full  bg-white p-[4px] text-base sm:text-lg"
        }
      >
        <img src={ChatbotIcon} className={"w-[56px]"} />
        <h1 className={"font-bold text-tolopea "}>Hello, I&apos;m Ceph</h1>
        <p
          className={
            "rounded-[0px_100px_100px_100px] bg-electric-violet px-[18px] py-[8px] font-bold text-white"
          }
        >
          How can I help?
        </p>
        {file != null && (
          <div>
            <div
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blaze-orange text-white hover:bg-electric-violet-200"
              onClick={() => {
                setSourceBoxOpen(!sourceBoxOpen);
              }}
            >
              ?
            </div>
            {sourceBoxOpen && (
              <SourceBox
                fileId={fileId}
                sourceContent={sourceContent ?? "error"}
                pages={pages ?? "error"}
                setIsOpen={setSourceBoxOpen}
                handleClickFile={() => {
                  handleClickFile(file);
                }}
              />
            )}
          </div>
        )}
        <XCircleIcon
          className={"mr-[10px] w-[36px] cursor-pointer resize text-tolopea"}
          onClick={() => {
            setIsOpen(false);
          }}
        />
      </div>
    </>
  );
};

export { ChatBotHeading };
