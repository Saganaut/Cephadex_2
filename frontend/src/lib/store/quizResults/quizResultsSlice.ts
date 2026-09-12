import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type QuizResultSchema } from "@source/client";
import { type RootState } from "@store/store";

import { logoutUser } from "../user/actions";
import {
  deleteOneQuizResult,
  getAssignedResults,
  getMyResults,
  getResultsForQuiz,
  getOneQuizResult,
} from "./actions";

import { getOneSharedQuiz } from "../quizzes/actions";
import { BuildingStorefrontIcon } from "@heroicons/react/20/solid";

const quizResultsAdapter = createEntityAdapter<QuizResultSchema>({
  selectId: (quizResult) => quizResult.id,
  sortComparer: (a, b) => a.id - b.id,
});

interface QuizResultsSliceState extends EntityState<QuizResultSchema> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}

const initialState: QuizResultsSliceState = quizResultsAdapter.getInitialState({
  status: "idle",
  error: "",
});

const quizResultsSlice = createSlice({
  name: "quizResults",
  initialState,
  reducers: {
    addQuizResult: (state, action: PayloadAction<QuizResultSchema>) => {
      quizResultsAdapter.addOne(state, action.payload);
    },
    removeQuizResult: (state, action: PayloadAction<number>) => {
      quizResultsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      quizResultsAdapter.removeAll(state);
    });
    builder.addCase(getResultsForQuiz.fulfilled, (state, action) => {
      if (action.payload.myResults != null) {
        quizResultsAdapter.upsertMany(state, action.payload.myResults);
        state.status = "succeeded";
      }
      if (action.payload.myStudentsResults != null) {
        quizResultsAdapter.upsertMany(state, action.payload.myStudentsResults);
        state.status = "succeeded";
      }
    });
    builder.addCase(deleteOneQuizResult.fulfilled, (state, action) => {
      quizResultsAdapter.removeOne(state, action.payload.resultId);
    });
    builder.addCase(getMyResults.fulfilled, (state, action) => {
      const quizzes = action.payload.quizAndResults;
      if (quizzes != null) {
        quizzes.forEach((result) => {
          if (result.results != null) {
            quizResultsAdapter.upsertMany(state, result.results);
          }
        });
      }
    });
    builder.addCase(getAssignedResults.fulfilled, (state, action) => {
      const quizzes = action.payload.quizAndResults;
      if (quizzes != null) {
        quizzes.forEach((result) => {
          if (result.results != null) {
            quizResultsAdapter.upsertMany(state, result.results);
          }
        });
      }
    });
    builder.addCase(getOneSharedQuiz.fulfilled, (state, action) => {
      if (action.payload.data != null) {
        if (action.payload.data.results != null) {
          quizResultsAdapter.upsertMany(state, action.payload.data.results);
        }
      }
    });

    builder.addCase(getOneQuizResult.fulfilled, (state, action) => {
      if (action.payload.quizResult != null) {
        quizResultsAdapter.upsertOne(state, action.payload.quizResult);
      }
    });
  },
});

export const { addQuizResult, removeQuizResult } = quizResultsSlice.actions;

export const selectByQuizID = createSelector(
  (state: RootState, testId: number) => state.quizResults.entities,
  (state: RootState, testId: number) => testId,
  (quizResults, testId) => {
    return (
      Object.values(quizResults).filter(
        (result) => result?.testId === testId
      ) || []
    );
  }
);

export default quizResultsSlice.reducer;
export const {
  selectAll: selectAllQuizResults,
  selectById: selectQuizResultById,
  selectIds: selectQuizResultIds,
} = quizResultsAdapter.getSelectors((state: RootState) => state.quizResults);
