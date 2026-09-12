/**This store is used for storing cards during the study sessions.
 *
 *
 * It can be used for regular study mode - using SRS and making frequent calls to the server,
 * as well as casual mode where all cards are frontloaded and swiped through with no SRS
 * (though pagination should eventually be implemented for large decks
 *
 * **/
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { StudyCardSchema } from "@source/client";
import type { RootState } from "@store/store";

import { logoutUser } from "../user/actions";
import {
  deleteOneCard,
  fetchCards,
  fetchDueCards,
  fetchDueNextCards,
  updateOne,
} from "./actions";

const cardInstancesAdapter = createEntityAdapter<StudyCardSchema>({
  selectId: (card) => card.uniqueId,
  // sortComparer: (a, b) => a.uniqueId - b.uniqueId,
});

const initialState = cardInstancesAdapter.getInitialState({
  status: "idle",
  error: "",
  batchNumber: 1,
  totalPages: 1, // Only used when fetching from casual mode to cycle deck back to start
  qtyCardsSeen: 0,
});
const cardInstancesSlice = createSlice({
  name: "cardInstances",
  initialState,
  reducers: {
    addManyCards: (state, action) => {
      if (isArrayOfStudyCardSchema(action.payload))
        cardInstancesAdapter.addMany(state, action.payload);
    },
    addOneCard: (state, action) => {
      if (isStudyCardSchema(action.payload))
        cardInstancesAdapter.addOne(state, action.payload);
    },
    removeOneCard: (state, action) => {
      if (isStudyCardSchema(action.payload))
        cardInstancesAdapter.removeOne(state, action.payload.id);
    },
    editOneCard: (state, action) => {
      if (isStudyCardSchema(action.payload))
        cardInstancesAdapter.setOne(state, action.payload);
    },
    clearAllCards: (state) => {
      cardInstancesAdapter.removeAll(state);
    },
    setCardInstancesStatusToIdle: (state) => {
      state.status = "idle";
    },
    resetBatchNumber: (state) => {
      state.batchNumber = 0;
    },
    resetCardInstancesSlice: (state) => {
      state.batchNumber = 0;
      state.totalPages = 1;
      cardInstancesAdapter.removeAll(state);
      state.status = "idle";
      state.error = "";
      state.qtyCardsSeen = 0;
    },
    incrementCardsSeen: (state, action) => {
      state.qtyCardsSeen += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //   For the first render, fetch the due cards
      .addCase(fetchCards.pending, (state) => {
        state.status = "loading";
      })
      // Loading cards for casual mode
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.cards != null) {
          cardInstancesAdapter.addMany(state, action.payload.cards);
          state.qtyCardsSeen += action.payload.cards.length;
        }

        if (action.payload.totalPages != null)
          state.totalPages = action.payload.totalPages;
        // if this is the last batch, so pageNumber === totalPages then reset pageNumber to 1
        if (action.payload.pageNumber != null)
          if (action.payload.pageNumber === action.payload.totalPages) {
            state.batchNumber = 1;
          }
          // otherwise just increment the batch number
          else {
            state.batchNumber = action.payload.pageNumber + 1;
          }
        // Need the below line to avoid bug where the batchNumber is not updating
        // void state.batchNumber;
      })

      // Loading cards for regular mode
      .addCase(fetchDueCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDueCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardInstancesAdapter.setAll(state, action.payload.cards);
        state.batchNumber = action.payload.batchNumber;
        state.qtyCardsSeen += action.payload.cards.length;
      })
      .addCase(fetchDueCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      //    FETCH DUE NEXT CARDS
      .addCase(fetchDueNextCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDueNextCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardInstancesAdapter.addMany(state, action.payload.cards);
        state.batchNumber = action.payload.batchNumber;
        state.qtyCardsSeen += action.payload.cards.length;
      })

      //   DELETE ONE CARD
      .addCase(deleteOneCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardInstancesAdapter.removeOne(state, action.payload.cardId);
      })
      .addCase(deleteOneCard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      //   UPDATE ONE CARD
      .addCase(updateOne.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCard = action.payload;
        cardInstancesAdapter.setOne(state, updatedCard);
      })
      .addCase(updateOne.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        cardInstancesAdapter.removeAll(state);
        state.status = "idle";
      });
  },
});
export const {
  addManyCards,
  addOneCard,
  removeOneCard,
  editOneCard,
  clearAllCards,
  setCardInstancesStatusToIdle,
  resetBatchNumber,
  resetCardInstancesSlice,
  incrementCardsSeen,
} = cardInstancesSlice.actions;
export default cardInstancesSlice.reducer;
export const {
  selectAll: selectAllCardInstances,
  selectById: selectCardInstancesById,
  selectIds: selectCardInstanceIds,
} = cardInstancesAdapter.getSelectors(
  (state: RootState) => state.cardInstances
);

export function isStudyCardSchema(obj: unknown): obj is StudyCardSchema {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const requiredFields: Record<
    keyof StudyCardSchema,
    (value: unknown) => boolean
  > = {
    id: (value) => typeof value === "number",
    term: (value) => typeof value === "string",
    content: (value) => value === null || typeof value === "string",
    boc2: (value) => value === null || typeof value === "string",
    boc3: (value) => value === null || typeof value === "string",
    boc4: (value) => value === null || typeof value === "string",
    formula: (value) => value === null || typeof value === "string",
    img: (value) => value === null || typeof value === "string",
    sound: (value) => value === null || typeof value === "string",
    bocId: () => true, // Optional field, skip validation
    boxId: () => true, // Optional field, skip validation
    createMethod: () => true, // Optional field, skip validation
    diffLvl: (value) => typeof value === "number",
    subject: (value) => value === null || typeof value === "string",
    topic: () => true, // Optional field, skip validation
    customFront: (value) => value === null || typeof value === "string",
    customBack: (value) => value === null || typeof value === "string",
    language: (value) => value === null || typeof value === "string",
    lenOption: () => true, // Optional field, skip validation
    qminOption: () => true, // Optional field, skip validation
    qmaxOption: () => true, // Optional field, skip validation
    category: (value) => typeof value === "string",
    deckId: () => true, // Optional field, skip validation
    srsInterval: (value) => typeof value === "number",
    timeUpdated: (value) => value === null || typeof value === "string",
    timesAsked: (value) => typeof value === "number",
    timesCorrect: (value) => typeof value === "number",
    timesCorrectRow: (value) => typeof value === "number",
    timeCreated: (value) => typeof value === "string",
    edited: (value) => typeof value === "boolean",
    fav: (value) => typeof value === "boolean",
    shareId: () => true, // Optional field, skip validation
    uniqueId: (value) => typeof value === "number",
    batchNumber: (value) => typeof value === "number",
  };

  for (const [field, validator] of Object.entries(requiredFields)) {
    if (
      !(field in obj) ||
      !validator((obj as Record<string, unknown>)[field])
    ) {
      return false;
    }
  }

  return true;
}

export function isArrayOfStudyCardSchema(
  arrayToAnalyze: unknown
): arrayToAnalyze is StudyCardSchema[] {
  if (!Array.isArray(arrayToAnalyze)) {
    return false;
  }
  if (
    isStudyCardSchema(arrayToAnalyze[0]) &&
    isStudyCardSchema(arrayToAnalyze[arrayToAnalyze.length - 1])
  ) {
    return true;
  }
  return false;
}
