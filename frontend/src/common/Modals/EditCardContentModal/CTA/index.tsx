import { processCardData } from "@common/Modals/NewCardModal/functions";
import { ConfirmButton } from "@source/common/Buttons/EditButtons/ConfirmButton";
import { DeleteButtonEdit } from "@source/common/Buttons/EditButtons/DeleteButton";
import { GenAiButton } from "@source/common/Buttons/EditButtons/RegenButton";
import { RestoreButton } from "@source/common/Buttons/EditButtons/RestoreButton";
import { deleteOneCard } from "@source/lib/store/cardInstances/actions";
import { generateNewCards } from "@source/lib/store/cards/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import { regenerateOneCard } from "@store/cards/actions";
import type { FormikProps } from "formik";
import React from "react";

import { DeleteConfirmationModal } from "../../DeleteConfirmationModal";
import { EditFormValues } from "../useEditCardContent";

interface CTAProps {
  formik: FormikProps<EditFormValues>;
  deckId?: number;
  type: "new" | "edit";
  cardId?: number;
  setNewCardTerm: React.Dispatch<React.SetStateAction<string>>;
  setNewCardCreated: React.Dispatch<React.SetStateAction<boolean>>;
  contentType?: "Quiz" | "Study" | "Cards";
  setEditCardModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CTA: React.FC<CTAProps> = ({
  formik,
  deckId,
  type,
  cardId,
  setNewCardTerm,
  setNewCardCreated,
  setEditCardModalIsOpen,
  contentType = "Cards",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();

  const autoGenerate = async (): Promise<void> => {
    await formik.validateField("term");
    await formik.setFieldTouched("term", true);
    if (
      formik.errors?.term &&
      typeof formik.errors.term === "string" &&
      formik.errors.term.length > 0
    ) {
      return;
    }
    setLoading(true);

    try {
      const cardData = processCardData(formik.values);

      if (deckId != null) {
        const response = await dispatch(
          generateNewCards({ deckId, cardData: [cardData] })
        );

        if (response.meta.requestStatus === "fulfilled") {
          if (setNewCardCreated != null && setNewCardTerm != null) {
            setNewCardTerm(response.payload.cards[0].term);
            setNewCardCreated(true);
          }
        }

        // formik.handleReset();
      }
    } finally {
      setLoading(false);
    }
  };

  /** Handle permanent deletion of card
   * TODO:
   * - Remove card from relevant slice
   * - Close edit modal on delete - Done
   */
  const handleDelete = (): void => {
    if (deckId == null || cardId == null) return;
    void dispatch(deleteOneCard({ deckId, cardId }));
    setEditCardModalIsOpen(false);
    setIsOpen(false);
  };

  const regenerate = async (): Promise<void> => {
    if (cardId != null && deckId != null) {
      setLoading(true);
      try {
        const response = await dispatch(regenerateOneCard({ deckId, cardId }));
        if (response.meta.requestStatus === "fulfilled") {
          setNewCardTerm(response.payload.body.term);
          setNewCardCreated(true);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      <div
        className={
          "mt-[20px] flex w-full items-center justify-between px-6  xl:px-12  "
        }>
        {type === "edit" && contentType !== "Quiz" && (
          <>
            <DeleteButtonEdit
              onClick={() => {
                setIsOpen(true);
              }}
            />

            <RestoreButton
              onClick={() => {
                formik.handleReset();
              }}
            />
          </>
        )}
        {contentType !== "Quiz" && (
          <GenAiButton
            loading={loading}
            label={type === "new" ? "Generate" : "Regenerate"}
            onClick={() => {
              if (type === "new") {
                void autoGenerate();
              } else {
                void regenerate();
              }
            }}
          />
        )}
        <ConfirmButton />
      </div>
      <DeleteConfirmationModal
        title={"Delete Card"}
        message={"Are you sure you want to delete this card?"}
        handleDelete={handleDelete}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};
export { CTA };
