import { useCardContext } from "@source/lib/contexts/CardContext";
import { useToast } from "@source/lib/contexts/ToastContext";
import { deleteOneCard } from "@source/lib/store/cardInstances/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React from "react";

import { DeleteConfirmationModal } from "..";

const DeleteCardModalSimple: React.FC = () => {
  const dispatch = useAppDispatch();
  const { postToast } = useToast();
  const { isDeleteCardModalOpen, setIsDeleteCardModalOpen, card } =
    useCardContext();

  const handleDeleteCard = async (): Promise<void> => {
    void dispatch(
      deleteOneCard({ cardId: card?.id, deckId: parseInt(card?.deckId) })
    );
    const frenchToast = {
      message: "Card Deleted",
      title: "Success!",
    };
    postToast(frenchToast);
  };

  return (
    <DeleteConfirmationModal
      handleDelete={() => {
        void handleDeleteCard();
      }}
      isOpen={isDeleteCardModalOpen}
      setIsOpen={setIsDeleteCardModalOpen}
      title="Delete deck"
      message="Are you sure you want to delete this card?"
    ></DeleteConfirmationModal>
  );
};
export { DeleteCardModalSimple };
