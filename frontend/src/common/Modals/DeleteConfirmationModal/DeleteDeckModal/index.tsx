import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import { useToast } from "@source/lib/contexts/ToastContext";
import { deleteOneDeck } from "@source/lib/store/decks/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React from "react";
import { useNavigate } from "react-router-dom";

import { DeleteConfirmationModal } from "..";

const DeleteDeckModal: React.FC = () => {
  const { postToast } = useToast();
  const { isDeleteDeckModalOpen, setIsDeleteDeckModalOpen, deckId } =
    useDeckContexts();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleDeleteDeck = async (): Promise<void> => {
    void dispatch(deleteOneDeck(deckId));
    const frenchToast = {
      message: "Deck Deleted",
      title: "Success!",
    };
    postToast(frenchToast);
    setIsDeleteDeckModalOpen(false);
    navigate("/decks");
  };

  return (
    <DeleteConfirmationModal
      handleDelete={() => {
        void handleDeleteDeck();
      }}
      isOpen={isDeleteDeckModalOpen}
      setIsOpen={setIsDeleteDeckModalOpen}
      title="Delete deck"
      message="Are you sure you want to delete this deck?"
    ></DeleteConfirmationModal>
  );
};
export { DeleteDeckModal };
