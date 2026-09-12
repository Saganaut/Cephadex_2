import { Paginator } from "@common/Form/Paginator";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import {
  reorderQuestions,
  selectAllTempQuestions,
  type TempQuestionSchema,
} from "@source/lib/store/tempQuestions/tempQuestionsSlice";
import { CreateQuizQuestionItem } from "@source/pages/Quizzes/components/CreateQuizQuestionItem";
import type { useCreateEditQuiz } from "@source/pages/Quizzes/hooks/useCreateEditQuiz";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";

import { NotFoundComponent } from "../InfoComponents/NotFoundComponent/NotFoundComponent";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface DragAndDropQuizItemProps {
  createQuizProps: ReturnType<typeof useCreateEditQuiz>;
}
/***
   Unless It's necessary, for performance or serious bugs, no need to refactor.
   ***/
type ISortValue = "question" | "qType" | "points";
type ISortKey = "question" | "category" | "points";
const sortValueLookup: Record<ISortKey, ISortValue> = {
  question: "question",
  category: "qType",
  points: "points",
};

const DragAndDropQuizItem: React.FC<DragAndDropQuizItemProps> = ({
  createQuizProps,
}) => {
  const dispatch = useAppDispatch();
  const cardsPerPage = 12;
  const questions = useAppSelector(selectAllTempQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  // Calculations
  const totalPages = Math.ceil((questions.length ?? 0) / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const onDragEnd = (result: DropResult): void => {
    if (result.destination == null) return;
    dispatch(
      reorderQuestions({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      })
    );
  };

  const [filteredQuestions, setFilteredQuestions] =
    useState<TempQuestionSchema[]>(questions);

  useEffect(() => {
    const searchQuery = createQuizProps.fetchParams.searchQuery;
    const order = createQuizProps.fetchParams.order?.toLowerCase() ?? "asc";
    const sortValueKey =
      createQuizProps.fetchParams.sortValue?.toLowerCase() as ISortKey;

    // If searchQuery is present, filter first
    let updatedQuestions = questions;

    if (searchQuery != null) {
      updatedQuestions = updatedQuestions.filter((question) =>
        question.term?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Handle sorting if order and sortValue are defined
    if (order != null && sortValueKey != null) {
      const sortValue = sortValueLookup[sortValueKey];

      updatedQuestions = updatedQuestions.sort((a, b) => {
        const valA = a[sortValue] ?? "";
        const valB = b[sortValue] ?? "";

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0; // Equal values
      });
    }

    // Update the filtered questions state
    setFilteredQuestions(updatedQuestions);
  }, [
    questions,
    createQuizProps.fetchParams.searchQuery,
    createQuizProps.fetchParams.order,
    createQuizProps.fetchParams.sortValue,
  ]);

  // const onDragEnd = (result: DropResult): void => {
  //     if (result.destination == null) return
  //     if (
  //         result.destination.index < indexOfFirstCard ||
  //         result.destination.index > indexOfLastCard
  //     )
  //         return
  //     createQuizProps.setOrderedQuestions((prevState) => {
  //         if (prevState == null || result.destination == null) return []
  //         const cards = Array.from(prevState) // Create a new array to not mutate the previous one
  //         const [removed] = cards.splice(result.source.index, 1) // Removes the drag item from the array by using the start index
  //         if (removed === undefined) return cards // Addding this to avoid the undefined error
  //         cards.splice(result.destination.index, 0, removed) // Inserts the moved item at its new position using the end index
  //         return cards // Returns the reordered array to the hook to be saved
  //     })
  // }

  // alternative to the array.filter

  // TODO: This is not working well with filter - the issue is even without drag and drop the qOrder is changing
  // After the sort, the component re-renders, the index is changed and so the index does not match the qOrder
  // we want the sort to change the qOrder, not just the index
  // useEffect(() => {
  //     if (
  //         createQuizProps.orderedQuestions == null ||
  //         createQuizProps.orderedQuestions.length === 0
  //     )
  //         return
  //     const UpdatedTempQuestionArrayAfterDnd: TempQuestionSchema[] =
  //         createQuizProps.orderedQuestions.map((c, index) => {
  //             return {
  //                 ...c,
  //                 qOrder: index,
  //             }
  //         })

  //     const isOrderChanged = UpdatedTempQuestionArrayAfterDnd.some(
  //         (updatedItem, index) => {
  //             return updatedItem.qOrder !== index
  //         }
  //     )
  //     if (isOrderChanged) {
  //         dispatch(updateManyTempQuestions(UpdatedTempQuestionArrayAfterDnd))
  //     }
  // }, [createQuizProps.orderedQuestions, dispatch])

  const isAllowed = (index: number, card: TempQuestionSchema): boolean => {
    if (card.term != null) {
      return (
        index >= indexOfFirstCard &&
        index < indexOfLastCard &&
        card.term
          .toLowerCase()
          .includes(createQuizProps.cardSearchQuery.toLowerCase())
      );
    }
    return false;
  };

  if (createQuizProps.deckId == null) return <NotFoundComponent />;

  return (
    <div>
      <DragDropContext
        onDragEnd={(result, provided) => {
          onDragEnd(result);
        }}>
        <StrictModeDroppable droppableId='DropId'>
          {(provided, snap) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {filteredQuestions.map((question, index) =>
                createQuizProps.showOnlySelected &&
                !question.selected ? null : (
                  <Draggable
                    key={question.id}
                    draggableId={question.id.toString()}
                    index={index}>
                    {(provided, snap) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={""}
                        style={{
                          ...provided.draggableProps.style,
                        }}>
                        {question !== undefined &&
                          isAllowed(index, question) && (
                            <CreateQuizQuestionItem
                              collapseMode={createQuizProps.collapseMode}
                              handleOpenCarousel={
                                createQuizProps.handleOpenCarousel
                              }
                              jeopardy={createQuizProps.jeopardy}
                              card={question}
                              deckId={parseInt(
                                createQuizProps.deckId ?? "0", // there is a check above to make sure that deckId is not undefined or null, so this shouldn't be an issue
                                10
                              )}
                            />
                          )}
                      </div>
                    )}
                  </Draggable>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <div className={"flex w-full items-center justify-center"}>
        <Paginator
          pageNumber={currentPage}
          setPageNumber={setCurrentPage}
          qtyPages={totalPages}
        />
      </div>
    </div>
  );
};
export default DragAndDropQuizItem;
