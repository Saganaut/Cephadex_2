import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { refreshDeckData } from "../store/decks/actions";
import { useAppDispatch } from "../store/hooks";
import { useMessagingModal } from "./MessagingContext";

interface DeckNotificationContextProps {
  isDeckReadyModalOpen: boolean;
  setIsDeckReadyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deckCompletionPercentage: number;
  setDeckCompletionPercentage: React.Dispatch<React.SetStateAction<number>>;
  deckTotalJobs: number;
  setDeckTotalJobs: React.Dispatch<React.SetStateAction<number>>;
  deckJobsCompleted: number;
  setDeckJobsCompleted: React.Dispatch<React.SetStateAction<number>>;
  slug: string | undefined;
  setSlug: React.Dispatch<React.SetStateAction<string | undefined>>;
  initializeWebSocket: () => void;
  deckId: string | undefined;
  setDeckId: React.Dispatch<React.SetStateAction<string | undefined>>;
  jobValues: object;
  setJobValues: React.Dispatch<React.SetStateAction<object>>;
  isCreatingDeck: boolean;
  setIsCreatingDeck: React.Dispatch<React.SetStateAction<boolean>>;
  creatingStatus: "idle" | "loading" | "success" | "failed";
  setCreatingStatus: React.Dispatch<
    React.SetStateAction<"idle" | "loading" | "success" | "failed">
  >;
  socketRef: React.MutableRefObject<WebSocket | null>;
  // useDeckNotificationWs: (slug: string | undefined) => void;
}
const DeckNotificationContext = createContext<
  DeckNotificationContextProps | undefined
>(undefined);

interface DeckNotificationProviderProps {
  children: React.ReactNode;
}
const DeckNotificationProvider: React.FC<DeckNotificationProviderProps> = ({
  children,
}) => {
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const dispatch = useAppDispatch();
  const [deckCompletionPercentage, setDeckCompletionPercentage] = useState(0);
  const [slug, setSlug] = useState<string | undefined>(undefined);
  const [deckTotalJobs, setDeckTotalJobs] = useState(1);
  const [deckJobsCompleted, setDeckJobsCompleted] = useState(0);
  const [deckId, setDeckId] = useState<string | undefined>("");
  const [jobValues, setJobValues] = useState({});
  const { setModalState } = useMessagingModal();
  const [isDeckReadyModalOpen, setIsDeckReadyModalOpen] = useState(false);
  const [creatingStatus, setCreatingStatus] = useState<
    "idle" | "loading" | "success" | "failed"
  >("idle");

  useEffect(() => {
    if (deckJobsCompleted > deckTotalJobs) {
      setDeckJobsCompleted(deckTotalJobs);
    }
    setDeckCompletionPercentage(
      deckTotalJobs > 0
        ? Math.round((deckJobsCompleted / deckTotalJobs) * 100)
        : 0
    );
  }, [deckJobsCompleted, deckTotalJobs]);

  const socketRef = useRef<WebSocket | null>(null);

  const messageProcessor = useCallback(
    (
      parts: string[],
      socketRef: React.MutableRefObject<WebSocket | null>
    ): void => {
      if (parts[0] === "ready") {
        setDeckId(parts[1]);
        setTimeout(() => {
          setModalState({
            isOpen: true,
            message: "Your deck is ready!",
            img: "",
            title: "Success!",
            type: "deckReady",
            optionalProps: { deckId },
            withFooter: false,
          });
        }, 1);
        if (socketRef.current != null) {
          socketRef.current.close(1000, "Closing connection normally");
        }

        void dispatch(refreshDeckData(Number(deckId)));
        setCreatingStatus("success");
        setDeckJobsCompleted(0);
      } else if (parts[0] === "complete") {
        setDeckJobsCompleted((prev) => prev + 1);
      } else if (parts[0] === "error") {
        setDeckJobsCompleted((prev) => prev + 1);
      } else if (parts[0] === "qty") {
        setDeckTotalJobs(parseInt(parts[1] ?? "1", 10));
        setDeckJobsCompleted(0);
      } else if (parts[0] === "failed") {
        if (socketRef.current !== null) {
          socketRef.current.close(1000, "Closing connection normally");
          setCreatingStatus("failed");
        }
      }
    },
    [deckId, dispatch, setModalState]
  );

  const initializeWebSocket = useCallback(() => {
    if (socketRef.current != null) {
      socketRef.current.close();
    }
    if (slug != null) {
      const url =
        import.meta.env.VITE_WS_BASE_URL +
        import.meta.env.VITE_NOTIFICATIONS_URL +
        slug;

      socketRef.current = new WebSocket(url);

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (typeof message === "string") {
          const parts = message.split(":");
          const messageProccesing = async (): Promise<void> => {
            messageProcessor(parts, socketRef);
          };
          void messageProccesing();
        }
      };
    }
    return () => {
      if (socketRef.current !== null) {
        socketRef.current.close();
        setSlug(undefined);
      }
      setDeckTotalJobs(1);
      setDeckJobsCompleted(0);
      setCreatingStatus("idle");
      setDeckCompletionPercentage(0);
    };
  }, [slug, messageProcessor]);

  return (
    <DeckNotificationContext.Provider
      value={{
        deckCompletionPercentage,
        setDeckCompletionPercentage,
        slug,
        setSlug,
        initializeWebSocket,
        deckTotalJobs,
        setDeckTotalJobs,
        deckJobsCompleted,
        setDeckJobsCompleted,
        deckId,
        jobValues,
        setJobValues,
        isDeckReadyModalOpen,
        setIsDeckReadyModalOpen,
        isCreatingDeck,
        setIsCreatingDeck,
        creatingStatus,
        setCreatingStatus,
        setDeckId,
        socketRef,
      }}>
      {children}
    </DeckNotificationContext.Provider>
  );
};

const useDeckNotificationContext = (): DeckNotificationContextProps => {
  return useContext(DeckNotificationContext)!;
};

export { DeckNotificationProvider };
export { DeckNotificationContext };
export { useDeckNotificationContext };
