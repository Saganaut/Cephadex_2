import { GroupService } from "@source/client";
import { useMessagingModal } from "@source/lib/contexts/MessagingContext";
// import { useDeckNotificationModal } from "@source/lib/contexts/DeckNotificationContext";
// import { useAppDispatch } from "@source/lib/store/hooks";
import { useCallback } from "react";
// todo add response types + add rest of hooks for other functionality
const useSaveDeck = (): ((
  groupId: number,
  deckId: number
) => Promise<void>) => {
  // const dispatch = useAppDispatch();
  const { setModalState } = useMessagingModal();
  // const {
  //   setImportedDeckMessage,
  //   openImportedDeckReadyModal,
  //   setImportedDeckId,
  // } = useDeckNotificationModal();

  const saveDeck = useCallback(
    async (groupId: number, deckId: number) => {
      const response = await GroupService.saveDeckFromGroup(groupId, deckId);
      if (response.message === "Deck already exists") {
        // setImportedDeckMessage("Deck already exists!");
        const newDeckId = response.decks?.[0]?.id;
        // setImportedDeckId(newDeckId?.toString());
        // openImportedDeckReadyModal();
        setModalState({
          isOpen: true,
          message: "Deck already exists!",
          img: "",
          title: "Uh oh!",
          type: "standard",
          optionalProps: { deckId: newDeckId },
          withFooter: true,
        });
        return;
      }
      const newDeckId = response.decks?.[0]?.id;
      // setImportedDeckId(newDeckId?.toString());
      // openImportedDeckReadyModal();
      setModalState({
        isOpen: true,
        message: "Deck saved!",
        img: "",
        title: "Success!",
        type: "standard",
        optionalProps: { deckId: newDeckId },
        withFooter: true,
      });
    },
    [
      // setImportedDeckMessage,
      // openImportedDeckReadyModal,
      // setImportedDeckId,

      setModalState,
    ]
  );

  return saveDeck;
};

export { useSaveDeck };
