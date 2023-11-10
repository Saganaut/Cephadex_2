import { createSlice } from "@reduxjs/toolkit";
import { type Quiz } from "@source/types/Quiz";
import { fetchQuizzesThunk } from "@services/Api/Quiz/QuizApiThunks";

interface QuizzesState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  loading: false,
  error: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setQuizzes } = quizzesSlice.actions;
export default quizzesSlice.reducer;
