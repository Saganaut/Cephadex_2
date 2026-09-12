import React, { createContext, useContext, useState } from "react";

interface FeedbackContextProps {
  isFeedbackModalOpen: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  setIsFeedbackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const FeedbackContext = createContext<FeedbackContextProps | undefined>(
  undefined
);

interface FeedbackProviderProps {
  children: React.ReactNode;
}
const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const openFeedbackModal = (): void => {
    setIsFeedbackModalOpen(true);
  };
  const closeFeedbackModal = (): void => {
    setIsFeedbackModalOpen(false);
  };

  return (
    <FeedbackContext.Provider
      value={{
        isFeedbackModalOpen,
        openFeedbackModal,
        closeFeedbackModal,
        setIsFeedbackModalOpen,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

const useFeedbackModal = (): FeedbackContextProps => {
  return useContext(FeedbackContext) as FeedbackContextProps;
};

export { FeedbackProvider };
export { FeedbackContext };
export { useFeedbackModal };
