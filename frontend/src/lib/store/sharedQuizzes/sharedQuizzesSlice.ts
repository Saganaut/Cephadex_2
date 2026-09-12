import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  type QuestionResultData,
  type QuizSharingFullSchema,
} from "@source/client";
import { type RootState } from "@store/store";
import { logoutUser } from "../user/actions";
import {
  deleteOneSharedQuiz,
  fetchSharedQuizzes,
  getOneSharedQuiz,
} from "./actions";

const sharedQuizzesAdapter = createEntityAdapter<QuizSharingFullSchema>({
  selectId: (value) => value.quiz.id,
});

interface SharedQuizzesSliceState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
  answers: QuestionResultData[];
}

const initialState: SharedQuizzesSliceState =
  sharedQuizzesAdapter.getInitialState({
    status: "idle",
    error: "",
    answers: [] as QuestionResultData[], // this for the taking the quiz
  });

const sharedQuizzesSlice = createSlice({
  name: "sharedQuizzes",
  initialState,
  reducers: {
    addAnswerToQuiz: (state, action: PayloadAction<QuestionResultData>) => {
      const newAnswer = action.payload;
      const existingAnswerIndex = state.answers.findIndex(
        (answer) => answer.questionId === newAnswer.questionId
      );

      if (existingAnswerIndex !== -1) {
        state.answers[existingAnswerIndex] = newAnswer;
      } else {
        state.answers.push(newAnswer);
      }
    },
    clearAnswers: (state) => {
      state.answers = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSharedQuizzes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSharedQuizzes.fulfilled, (state, action) => {
        state.status = "succeeded";
        sharedQuizzesAdapter.setAll(state, action.payload ?? []);
      })
      .addCase(deleteOneSharedQuiz.fulfilled, (state, action) => {
        sharedQuizzesAdapter.removeOne(state, action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        sharedQuizzesAdapter.removeAll(state);
        state.status = "idle";
      });
  },
});
export const { addAnswerToQuiz, clearAnswers } = sharedQuizzesSlice.actions;

export default sharedQuizzesSlice.reducer;
export const {
  selectAll: selectAllSharedQuizzes,
  selectById: selectSharedQuizById,
  selectIds: selectSharedQuizIds,
} = sharedQuizzesAdapter.getSelectors(
  (state: RootState) => state.sharedQuizzes
);
