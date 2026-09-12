/** Edit Card Modal
 *
 * All the logic for the EditCardContent modal
 *
 *
 *
 * TODO:
 * - Fix all the API calls
 **/

import type {
  CardDataResponse,
  CardSchema,
  StudyCardSchema,
} from "@source/client";
import type { CardType } from "@source/common/Form/CardTypeSelector/cardTypes";
import { useToast } from "@source/lib/contexts/ToastContext";
import { editCard } from "@source/lib/store/cards/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import { updateOneTempQuestion } from "@source/lib/store/tempQuestions/actions";
import type { TempQuestionSchema } from "@source/lib/store/tempQuestions/tempQuestionsSlice";
import { findDifferentValues } from "@source/lib/utils/functions";
import type { CombinedSchema } from "@source/pages/Quizzes/components/CreateQuizQuestionItem/Question";
import { updateOne } from "@store/cardInstances/actions";
import { addCardToHistory } from "@store/cardsHistory/cardsHistorySlice";
import React, { useEffect } from "react";
import * as Yup from "yup";

export interface EditFormValues {
  term: string;
  content: string;
  boc2: string;
  boc3: string;
  boc4: string;
  subject: string | null;
  category: string | CardType;
  topic: string | null;
  formula: string | null;
}
const validationSchema = Yup.object({
  term: Yup.string()
    .max(1000, "Front of card has a maximum length of 1000 characters")
    .min(1, "Front of card cannot be empty")
    .required("Front of card is required required"),
  content: Yup.string()
    .max(1000, "Back of card fields must be 1000 characters or less")
    .required("Back of card is required"),
  boc2: Yup.string().max(
    1000,
    "Back of card fields must be 1000 characters or less"
  ),
  boc3: Yup.string().max(
    1000,
    "Back of card fields must be 1000 characters or less"
  ),
  boc4: Yup.string().max(
    1000,
    "Back of card fields must be 1000 characters or less"
  ),

  // Add other fields as needed
});
type CardTypes = StudyCardSchema | CardSchema | CombinedSchema;

export type HandleUpdateSchema = <T extends CardTypes>(
  card: T,
  remove: boolean
) => void;

interface useEditCardContentReturn {
  initialValues: EditFormValues;
  validationSchema: unknown;
  handleCardUpdate: (values: EditFormValues) => Promise<void>;
  setOldValues: React.Dispatch<React.SetStateAction<EditFormValues | null>>;
  newCardCreated: boolean;
  editingBack: boolean;
  editingFront: boolean;
  newCardTerm: string;
  changedValues: string[];
  setEditingBack: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCardCreated: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCardTerm: React.Dispatch<React.SetStateAction<string>>;
  setEditingFront: React.Dispatch<React.SetStateAction<boolean>>;
  isMcq: boolean;
  status: "success" | "error" | "loading" | null;
}

const useEditCardContent = ({
  activeCard,
  isOpen,
  type,
  deckId,
  handleUpdateSchema,
}: {
  activeCard: StudyCardSchema | CardSchema | TempQuestionSchema | null;
  isOpen: boolean;
  type: string;
  deckId: string;
  handleUpdateSchema?: HandleUpdateSchema;
}): useEditCardContentReturn => {
  const [status, setStatus] = React.useState<
    "success" | "error" | "loading" | null
  >(null);

  const [oldValues, setOldValues] = React.useState<EditFormValues | null>(null);
  const [changedValues, setChangedValues] = React.useState<string[]>([]);
  const [newCardCreated, setNewCardCreated] = React.useState(false);
  const [newCardTerm, setNewCardTerm] = React.useState("");
  const [editingFront, setEditingFront] = React.useState(false);
  const [editingBack, setEditingBack] = React.useState(false);

  const dispatch = useAppDispatch();
  const { postToast } = useToast();

  // const slicedCardTypes = cardTypes.slice(1);

  useEffect(() => {
    setStatus(null);
    setChangedValues([]);
  }, [isOpen]);

  const isStudyCard = (
    card: CardSchema | StudyCardSchema | TempQuestionSchema | null
  ): card is StudyCardSchema => {
    return (card as StudyCardSchema)?.batchNumber !== undefined;
  };

  const isTempQuestion = (
    card: CardSchema | StudyCardSchema | TempQuestionSchema | null
  ): card is TempQuestionSchema => {
    return (card as TempQuestionSchema)?.qType !== undefined;
  };

  const initialValues: EditFormValues = isTempQuestion(activeCard)
    ? {
        term: activeCard?.term ?? "",
        content: activeCard?.content ?? "",
        boc2: activeCard?.boc2 ?? "",
        boc3: activeCard?.boc3 ?? "",
        boc4: activeCard?.boc4 ?? "",
        subject: activeCard?.promptOption ?? "",
        category: activeCard?.qType ?? "",
        topic: activeCard?.promptOption ?? "",
        formula: null,
      }
    : {
        term: activeCard?.term ?? "",
        content: activeCard?.content ?? "",
        boc2: activeCard?.boc2 ?? "",
        boc3: activeCard?.boc3 ?? "",
        boc4: activeCard?.boc4 ?? "",
        subject: activeCard?.subject ?? "",
        category: activeCard?.category ?? "",
        topic: activeCard?.topic ?? "",
        formula: null,
      };

  const isMcq =
    (isTempQuestion(activeCard) && activeCard.qType === "Mcq") ||
    (!isTempQuestion(activeCard) && activeCard?.category === "Mcq");

  useEffect(() => {
    const handleChange = (): void => {
      const differentKeys = findDifferentValues(oldValues, initialValues);
      setChangedValues(differentKeys);
    };
    handleChange();
  }, [status]); // eslint-disable-line
  // TODO ideally include all dependencies here at some point

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (newCardCreated) {
      timeoutId = setTimeout(() => {
        setNewCardCreated(false);
      }, 3000);
    }
    return () => {
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [newCardCreated]);

  const handleCardUpdate = async (values: EditFormValues): Promise<void> => {
    if (type === "Quiz") {
      if (activeCard == null) return;
      if (isTempQuestion(activeCard)) {
        const tempQuestion = {
          ...activeCard,
          term: values.term,
          content: values.content,
          question: values.term,
          boc2: values.boc2,
          boc3: values.boc3,
          boc4: values.boc4,
          qType: values.category,
        };
        dispatch(updateOneTempQuestion(tempQuestion));
        return;
      }
    }

    if (activeCard?.id == null || deckId == null) return;
    setStatus("loading");

    const body = {
      content: values.content,
      term: values.term,
      boc2: values.boc2,
      boc3: values.boc3,
      boc4: values.boc4,
      subject: values.subject,
      category: values.category,
      topic: values.topic,
    };

    dispatch(
      editCard({
        deckId: parseInt(deckId, 10),
        cardId: activeCard.id,
        body,
      })
    )
      .then((response) => {
        const returnedPayload = response.payload as CardDataResponse;
        if (returnedPayload.cards == null) {
          setStatus("error");
          return;
        }
        const returnedCard = returnedPayload.cards[0];
        if (type === "Study" && isStudyCard(activeCard)) {
          if (returnedCard != null) {
            dispatch(
              addCardToHistory({
                ...returnedCard,
                uniqueId: activeCard.uniqueId,
                deckId: parseInt(deckId, 10),
                batchNumber: activeCard.batchNumber,
                id: activeCard.id,
              })
            );

            void dispatch(
              updateOne({
                ...returnedCard,
                uniqueId: activeCard.uniqueId,
                deckId: parseInt(deckId, 10),
                batchNumber: activeCard.batchNumber,
                id: activeCard.id,
              })
            );
          }
        }
        if (handleUpdateSchema != null && returnedCard != null) {
          handleUpdateSchema(returnedCard, false);
        }
        setNewCardCreated(true);
        setNewCardTerm(returnedCard?.term ?? "Unknown");
        setStatus("success");
        const frenchToast = {
          message: "Card Updated",
          title: "Success!",
        };
        postToast(frenchToast);
      })
      .catch(() => {
        setStatus("error");
      });
  };

  return {
    initialValues,
    validationSchema,
    handleCardUpdate,
    setOldValues,
    newCardCreated,
    editingBack,
    editingFront,
    newCardTerm,
    changedValues,
    setEditingBack,
    setNewCardCreated,
    setNewCardTerm,
    setEditingFront,
    isMcq,
    status,
  };
};

export default useEditCardContent;
