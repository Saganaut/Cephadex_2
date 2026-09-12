import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StudyCardSchema } from "@source/client";
import type { RootState } from "@store/store";

import { logoutUser } from "../user/actions";

const initialState = {
  cardsHistory: [] as StudyCardSchema[],
  status: "idle",
};

export const cardsHistorySlice = createSlice({
  name: "cardsHistory",
  initialState,
  reducers: {
    addCardToHistory: (state, action: PayloadAction<StudyCardSchema>) => {
      const newCard = action.payload;
      const existingCardIndex = state.cardsHistory.findIndex(
        (card) => card.uniqueId === newCard.uniqueId
      );
      if (existingCardIndex !== -1) {
        // Card with the same ID already exists, update it
        state.cardsHistory[existingCardIndex] = newCard;
      } else {
        // Card with the ID doesn't exist in the existing deck, push the new card
        state.cardsHistory.push(newCard);
      }
    },
    removeOneCardFromHistory: (
      state,
      action: PayloadAction<StudyCardSchema>
    ) => {
      const cardToRemove = action.payload;
      const existingCardIndex = state.cardsHistory.findIndex(
        (card) => card.uniqueId === cardToRemove.uniqueId
      );

      if (existingCardIndex !== -1) {
        state.cardsHistory.splice(existingCardIndex, 1);
      }
    },
    removeAllCardsFromHistory: (state) => {
      state.cardsHistory = [];
    },
    resetCardsHistorySlice: (state) => {
      state.cardsHistory = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.cardsHistory = [];
      state.status = "idle";
    });
  },
});

export const {
  addCardToHistory,
  removeOneCardFromHistory,
  removeAllCardsFromHistory,
  resetCardsHistorySlice,
} = cardsHistorySlice.actions;
export const selectCardsHistory = (state: RootState): StudyCardSchema[] => {
  return state.cardsHistory.cardsHistory;
};
export default cardsHistorySlice.reducer;
