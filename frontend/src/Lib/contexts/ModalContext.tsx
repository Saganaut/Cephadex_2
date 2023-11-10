import React, { createContext, useContext, useState } from "react";

interface ModalContextProps {
  isSignInModalOpen: boolean;
  openSignInModal: () => void;
  closeSignInModal: () => void;
  isRegisterModalOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}
const ModalContext = createContext<ModalContextProps | null>(null);

interface ModalProviderProps {
  children: React.ReactNode;
}
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openSignInModal = (): void => {
    setIsSignInModalOpen(true);
  };
  const closeSignInModal = (): void => {
    setIsSignInModalOpen(false);
  };
  const openRegisterModal = (): void => {
    setIsRegisterModalOpen(true);
  };
  const closeRegisterModal = (): void => {
    setIsRegisterModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isSignInModalOpen,
        openSignInModal,
        closeSignInModal,
        isRegisterModalOpen,
        openRegisterModal,
        closeRegisterModal,
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
