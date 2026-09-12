import React, { createContext, useContext, useState } from "react";

interface ModalContextProps {
  isSignInModalOpen: boolean;
  openSignInModal: (type: string) => void;
  closeSignInModal: () => void;
  modalType: string;
  setModalType?: React.Dispatch<React.SetStateAction<string>>;
}
const ModalContext = createContext<ModalContextProps | null>(null);

interface ModalProviderProps {
  children: React.ReactNode;
}
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const openSignInModal = (type: string): void => {
    setIsSignInModalOpen(true);
    setModalType(type);
  };
  const closeSignInModal = (): void => {
    setIsSignInModalOpen(false);
    setModalType("login");
  };

  return (
    <ModalContext.Provider
      value={{
        isSignInModalOpen,
        openSignInModal,
        closeSignInModal,
        setModalType,
        modalType,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const useModal = (): ModalContextProps => {
  return useContext(ModalContext) as ModalContextProps;
};

export { ModalProvider };
export { useModal };
