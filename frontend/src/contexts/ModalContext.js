import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);


  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  console.log("SignInModalProvider")
  return (
    <ModalContext.Provider value={{
      isSignInModalOpen,
      openSignInModal,
      closeSignInModal,
      isRegisterModalOpen,
      openRegisterModal,
      closeRegisterModal
       }}>
      {children}
    </ModalContext.Provider>
  );
};

const useModal = () => {
  console.log("useSignInModal")
  return useContext(ModalContext);
};

export { ModalProvider }
export { useModal }