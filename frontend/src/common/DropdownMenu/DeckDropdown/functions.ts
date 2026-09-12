// import { DeckService, GroupService } from "@source/client";
// import { useMessagingModal } from "@source/lib/contexts/MessagingContext";
// // import { useDeckNotificationModal } from "@source/lib/contexts/DeckNotificationContext";
// import { copyPublicDeck } from "@source/lib/store/decks/actions";
// import { useAppDispatch } from "@source/lib/store/hooks";
// import { removeOneDeckFromGroup } from "@store/group/actions";
// // const {
// //   isImportedDeckReadyModalOpen,
// //   openImportedDeckReadyModal,
// //   closeImportedDeckReadyModal,
// //   importedDeckId,
// //   setImportedDeckId,
// //   setImportedDeckMessage,
// // } = useDeckNotificationModal();

// // ! All of this should be obsolete?
// const dispatch = useAppDispatch();
// const { setModalState, modalState } = useMessagingModal();
// const saveDeck = async (groupId: number, deckId: number) => {
//   const response = await GroupService.saveDeckFromGroup(groupId, deckId);
//   if (response.message === "Deck already exists") {
//     // setImportedDeckMessage("Deck already exists!");
//     const newDeckId = response.decks?.[0]?.id;
//     // setImportedDeckId(newDeckId?.toString());
//     // openImportedDeckReadyModal();
//     setModalState({
//       ...modalState,
//       isOpen: true,
//       message: "Deck already exists!",
//       optionalProps: { deckId: newDeckId?.toString() },
//     });
//     return;
//   }
//   const newDeckId = response.decks?.[0]?.id;
//   // setImportedDeckId(newDeckId?.toString());
//   // openImportedDeckReadyModal();
//   setModalState({
//     ...modalState,
//     isOpen: true,
//     message: "Deck saved successfully!",
//     optionalProps: { deckId: newDeckId?.toString() },
//   });
// };

// const downloadDeckAsCsv = (deckId: number) => {
//   downloadCsv(deckId);
//   close();
// };
// const downloadCsv = async (deckId: number) => {
//   try {
//     const data = await DeckService.getDeckCsv(deckId);
//     const blob = new Blob([data], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${deckId}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("There was an issue downloading the file:", error);
//   }
// };

// const savePublicDeck = async (deckId: number) => {
//   const actionResult = await dispatch(copyPublicDeck(deckId));
//   const response = actionResult.payload;

//   if (response.message === "Deck already exists") {
//     // setImportedDeckMessage("Deck already exists!");
//     const newDeckId = response.decks?.[0]?.id;
//     // setImportedDeckId(newDeckId?.toString());
//     // openImportedDeckReadyModal();
//     setModalState({
//       ...modalState,
//       isOpen: true,
//       message: "Deck already exists!",
//       optionalProps: { deckId: newDeckId?.toString() },
//     });
//     return;
//   }
//   const newDeckId = response.decks?.[0]?.id;
//   // setImportedDeckId(newDeckId?.toString());
//   // openImportedDeckReadyModal();
//   setModalState({
//     ...modalState,
//     isOpen: true,
//     message: "Deck saved successfully!",
//     optionalProps: { deckId: newDeckId?.toString() },
//   });
// };

// const deleteDeckFromGroup = async (
//   groupId: number,
//   deckId: number
// ): Promise<void> => {
//   void dispatch(removeOneDeckFromGroup({ groupId, deckId }));
//   close();
// };

// const studyDeck = (
//   itemId: number | undefined,
//   navigate: (path: string) => void
// ): void => {
//   navigate("/study/deck/" + itemId);
// };

// export {
//   deleteDeckFromGroup,
//   downloadDeckAsCsv,
//   saveDeck,
//   savePublicDeck,
//   studyDeck,
// };
