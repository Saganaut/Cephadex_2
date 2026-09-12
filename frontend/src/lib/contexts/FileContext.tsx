import { type DeckFilesSchema } from "@source/client";
import React, { createContext, useContext, useState } from "react";

interface FileContextProps {
  fileModalIsOpen: boolean;
  setFileModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  file: DeckFilesSchema | undefined;
  setFile: React.Dispatch<React.SetStateAction<DeckFilesSchema | undefined>>;
  deckId: number;
  setDeckId: React.Dispatch<React.SetStateAction<number>>;
}

interface FileContextProviderProps {
  children: React.ReactNode;
}

const FileContext = createContext<FileContextProps | undefined>(undefined);

const FileContextProvider: React.FC<FileContextProviderProps> = ({
  children,
}) => {
  const [fileModalIsOpen, setFileModalIsOpen] = useState(false);
  const [file, setFile] = useState<DeckFilesSchema>();
  const [deckId, setDeckId] = useState<number>(0);

  return (
    <FileContext.Provider
      value={{
        fileModalIsOpen,
        setFileModalIsOpen,
        file,
        setFile,
        deckId,
        setDeckId,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

const useFileContext = (): FileContextProps => {
  const context = useContext(FileContext);
  if (context == null) {
    throw new Error("useFileContext must be used within a FileContextProvider");
  }
  return context;
};

export { FileContext, FileContextProvider, useFileContext };
