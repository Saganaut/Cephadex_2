/** Storing all answers for study sessions
 * **/

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@store/store";

import { logoutUser } from "../user/actions";

export interface Answer {
  cardId: number;
  action: "incr" | "decr" | "skip" | "easy" | "hard";
  uniqueId: number;
  deckId: number;
}

const initialState = {
  answers: [] as Answer[],
  status: "idle",
};

export const answersSlice = createSlice({
  name: "answers",
  initialState,

  reducers: {
    addAnswer: (state, action: PayloadAction<Answer>) => {
      const newAnswer = action.payload;

      const existingAnswer = state.answers.findIndex(
        (a) => a.uniqueId === newAnswer.uniqueId
      );

      if (existingAnswer !== -1) {
        state.answers[existingAnswer] = newAnswer;
      } else {
        // Card with the ID doesn't exist in the existing deck, push the new card
        state.answers.push(newAnswer);
      }
    },
    removeAllAnswers: (state) => {
      state.answers = [];
    },
    removeAllAnswersByDeckId: (state, action: PayloadAction<string>) => {
      const deckIdToRemove = action.payload;
      state.answers = state.answers.map((answer) => {
        if (answer.deckId === parseInt(deckIdToRemove)) {
          // Remove all cards for the specified deckId
          return { ...answer, cards: [] };
        }
        return answer;
      });
    },
    resetAnswersSlice: (state) => {
      state.answers = [];
      state.status = "idle";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.answers = [];
    });
  },
});

export const {
  addAnswer,
  removeAllAnswersByDeckId,
  removeAllAnswers,
  resetAnswersSlice,
} = answersSlice.actions;
export const selectAnswers = (state: RootState): Answer[] => {
  return state.answers.answers;
};
export default answersSlice.reducer;
