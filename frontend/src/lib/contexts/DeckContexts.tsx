import React, { createContext, useContext, useState } from "react";

interface DeckContextsProps {
  isDeleteDeckModalOpen: boolean;
  setIsDeleteDeckModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareDeckModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isShareDeckModalOpen: boolean;
  deckId: number;
  setDeckId: React.Dispatch<React.SetStateAction<number>>;
  setDeckEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deckEditModalIsOpen: boolean;
  setExportDeckModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exportDeckModalIsOpen: boolean;
  setImportDeckModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  importDeckModalIsOpen: boolean;
  setNewCardModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newCardModalIsOpen: boolean;
}

interface DeckContextsProviderProps {
  children: React.ReactNode;
}

const DeckContexts = createContext<DeckContextsProps | undefined>(undefined);

const DeckContextsProvider: React.FC<DeckContextsProviderProps> = ({
  children,
}) => {
  const [isDeleteDeckModalOpen, setIsDeleteDeckModalOpen] = useState(false);
  const [deckId, setDeckId] = useState<number>(0);
  const [isShareDeckModalOpen, setIsShareDeckModalOpen] = useState(false);
  const [exportDeckModalIsOpen, setExportDeckModalIsOpen] = useState(false);
  const [deckEditModalIsOpen, setDeckEditModalIsOpen] = useState(false);
  const [importDeckModalIsOpen, setImportDeckModalIsOpen] = useState(false);
  const [newCardModalIsOpen, setNewCardModalIsOpen] = useState(false);

  return (
    <DeckContexts.Provider
      value={{
        isDeleteDeckModalOpen,
        setIsDeleteDeckModalOpen,
        deckId,
        setDeckId,
        isShareDeckModalOpen,
        setIsShareDeckModalOpen,
        exportDeckModalIsOpen,
        setExportDeckModalIsOpen,
        deckEditModalIsOpen,
        setDeckEditModalIsOpen,
        importDeckModalIsOpen,
        setImportDeckModalIsOpen,
        newCardModalIsOpen,
        setNewCardModalIsOpen,
      }}
    >
      {children}
    </DeckContexts.Provider>
  );
};

const useDeckContexts = (): DeckContextsProps => {
  return useContext(DeckContexts) as DeckContextsProps;
};

export { DeckContextsProvider };
export { DeckContexts };
export { useDeckContexts };
