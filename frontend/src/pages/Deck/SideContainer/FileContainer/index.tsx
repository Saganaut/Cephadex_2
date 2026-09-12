import { type DeckSchema } from "@client/models/DeckSchema";
import { type DeckFilesSchema } from "@source/client";
import { FileModal } from "@source/common/Modals/FileModal";
import { useFileContext } from "@source/lib/contexts/FileContext";
import { fetchDeckFiles } from "@source/lib/store/deckFiles/actions";
import { selectDeckFilesByIds } from "@source/lib/store/deckFiles/deckFilesSlice";
import { selectDeckFileIdsByDeckId } from "@source/lib/store/decks/decksSlice";
import { type RootState } from "@source/lib/store/store";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { useEffect } from "react";

import { FileItem } from "./FileItem";
import { Loading } from "@source/common/InfoComponents/Loading";

interface FileContainerProps {
  deck: DeckSchema;
  isCollapsed: boolean;
}

// TODO: properly fetch the relevant deck files instead of teh entire state
const FileContainer: React.FC<FileContainerProps> = ({ deck, isCollapsed }) => {
  const dispatch = useAppDispatch();
  const { setFile, setFileModalIsOpen, setDeckId } = useFileContext();
  const [deckFileStatus, setDeckFileStatus] = React.useState("idle");
  const deckFileIds = useAppSelector((state: RootState) =>
    selectDeckFileIdsByDeckId(state, deck.id)
  );
  const deckFiles = useAppSelector((state: RootState) =>
    selectDeckFilesByIds(state, deckFileIds ?? null)
  );

  useEffect(() => {
    const fectchDeckFiles = async() => {

    setDeckFileStatus("pending");
    await dispatch(fetchDeckFiles(deck.id));
      setDeckFileStatus("fulfilled");
      
    }

    if (deckFileStatus === "idle") {
      fectchDeckFiles();
    }
    
  }, [deck.id, dispatch, deckFileStatus]);

  const handleClickFile = (file: DeckFilesSchema): void => {
    if (file == null) return;
    setFile(file);
    setDeckId(deck.id);
    setFileModalIsOpen(true);
  };

  return (
    <>
      <div className={"min-w-[200px] rounded-[18px] p-[10px] sm:min-w-[400px]"}>
        <div className="rounded-2xl  p-2">
          {!isCollapsed ? (
            <>
              <div className="flex items-center justify-between">
                <h1 className={"mb-2 text-lg "}>Documents</h1>{" "}
                {/* <EditNoBorder
                  className={"h-[25px] w-[25px] cursor-pointer  "}
                  onClick={() => {}}
                /> */}
              </div>
              {deckFileStatus === "pending" ? 
              <div className = "h-4 w-4">
              <Loading size = "small" withMessage = {false} /></div>
              :
              <div className={"mx-auto  "}>
                {deckFiles?.map((file) => (
                  <div
                    className="cursor-pointer"
                    key={file?.id}
                    onClick={() => {
                      handleClickFile(file);
                    }}
                  >
                    <FileItem file={file} type="file" />
                  </div>
                ))}
              </div> }
            </>
          ) : (
            <h1 className={"text-2xl "}>Files</h1>
          )}
        </div>
      </div>
      <FileModal />
    </>
  );
};

export { FileContainer };
