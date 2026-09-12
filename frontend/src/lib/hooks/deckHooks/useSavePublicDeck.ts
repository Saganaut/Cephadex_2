import CephCircleUnsure from "@assets/bubbles/CephCircleUnsure.png";
import { useMessagingModal } from "@source/lib/contexts/MessagingContext";
import { copyPublicDeck } from "@source/lib/store/decks/actions";
import { useAppDispatch } from "@source/lib/store/hooks";

const useSavePublicDeck = (): ((deckId: number) => Promise<any>) => {
  const dispatch = useAppDispatch();
  // const {
  //   setImportedDeckMessage,
  //   openImportedDeckReadyModal,
  //   setImportedDeckId,
  // } = useDeckNotificationModal();
  const { setModalState } = useMessagingModal();

  const savePublicDeck = async (deckId: number): Promise<any> => {
    const actionResult = await dispatch(copyPublicDeck(deckId));
    const response = actionResult.payload;

    if (response.message === "Deck already exists") {
      // setImportedDeckMessage("Deck already exists!");
      //   const newDeckId = response.decks?.[0]?.id;
      // setImportedDeckId(newDeckId?.toString());
      // openImportedDeckReadyModal();
      setModalState({
        isOpen: true,
        message: "Deck already exists!",
        img: CephCircleUnsure,
        title: "Uh oh!",
        type: "standard",
        optionalProps: {},
        withFooter: false,
      });
      return;
    }
    // const newDeckId = response.decks?.[0]?.id;
    // setImportedDeckId(newDeckId?.toString());
    // openImportedDeckReadyModal();
    setModalState({
      isOpen: true,
      message: "Deck saved!",
      img: "",
      title: "Success!",
      type: "standard",
      optionalProps: {},
      withFooter: true,
    });
  };

  return savePublicDeck;
};

export { useSavePublicDeck };
