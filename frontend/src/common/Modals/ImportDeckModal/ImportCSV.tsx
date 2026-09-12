import { type Body_import_cards_from_csv, DeckService } from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { useToast } from "@source/lib/contexts/ToastContext";
import { useAppDispatch } from "@source/lib/store/hooks";
import { importCardsFromCSV } from "@store/cards/actions";
import React, { useState } from "react";

import { MyDropZone } from "../../Form/MyDropZone";

interface ImportCSVProps {
  deckId: number;
}

const ImportCSV: React.FC<ImportCSVProps> = ({ deckId }) => {
  const { postToast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const onFileDrop = (acceptedFiles: File[]): void => {
    const csvFiles = acceptedFiles.filter(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv")
    );

    setFiles((prevFiles) => [...prevFiles, ...csvFiles]);
  };
  const deleteFile = (fileName: string): void => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.name !== fileName)
    );
    const lostToast = {
      message: "File Deleted",
      title: "Success!",
    };
    postToast(lostToast);
  };

  const handleImport = async (): Promise<void> => {
    const formData = new FormData();
    formData.append("files", files);

    const body: Body_import_cards_from_csv = {
      files,
    };
    void dispatch(importCardsFromCSV({ deckId, formData: body }));
    const frenchToast = {
      message: "Cards Imported",
      title: "Success!",
    };
    postToast(frenchToast);
  };

  return (
    <>
      <div className="mx-[32px] cursor-pointer rounded-2xl border-2 border-dashed border-electric-violet-200 dark:border-white">
        <MyDropZone onFileDrop={onFileDrop} />
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {file.name} - {file.size} bytes
              <button
                onClick={() => {
                  deleteFile(file.name);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={"flex items-center justify-center gap-x-[16px] pt-[18px]"}
      >
        <Button onClick={handleImport} label={"Cancel"} />
        <Button onClick={handleImport} label={"Import"} />
      </div>
    </>
  );
};

export { ImportCSV };
