import React, {
  createContext,
  type ReactElement,
  useContext,
  useState,
} from "react";

interface MessagingModalContextProps {
  modalState: {
    isOpen: boolean;
    message: string;
    img: string;
    title: string;
    type:
      | "standard"
      | "deckReady"
      | "insufficientCredit"
      | "deckSaved"
      | "error";
    optionalProps: { deckId?: string };
    withFooter: boolean;
  };
  setModalState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      message: string;
      img: string;
      title: string;
      type:
        | "standard"
        | "deckReady"
        | "insufficientCredit"
        | "deckSaved"
        | "error";
      optionalProps: object;
      withFooter: boolean;
    }>
  >;
  setIsMessageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeckNotificationProviderProps {
  children: React.ReactNode;
}

const MessagingModalContext = createContext<
  MessagingModalContextProps | undefined
>(undefined);

export const MessagingModalProvider: React.FC<
  DeckNotificationProviderProps
> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    message: string;
    img: string;
    title: string;
    type:
      | "standard"
      | "deckReady"
      | "insufficientCredit"
      | "deckSaved"
      | "error";
    optionalProps: { deckId?: string };
    withFooter: boolean;
  }>({
    isOpen: false,
    message: "",
    img: "",
    title: "",
    type: "standard",
    optionalProps: {},
    withFooter: false,
  });
  const setIsMessageModalOpen = (
    open: boolean | ((prevState: boolean) => boolean)
  ): void => {
    setModalState((prevState) => ({
      ...prevState,
      isOpen: typeof open === "function" ? open(prevState.isOpen) : open,
    }));
  };
  return (
    <MessagingModalContext.Provider
      value={{ modalState, setModalState, setIsMessageModalOpen }}
    >
      {children}
    </MessagingModalContext.Provider>
  );
};

export const useMessagingModal = (): MessagingModalContextProps => {
  const context = useContext(MessagingModalContext);
  if (context == null) {
    throw new Error(
      "useMessagingModal must be used within a MessagingModalProvider"
    );
  }
  return context;
};
