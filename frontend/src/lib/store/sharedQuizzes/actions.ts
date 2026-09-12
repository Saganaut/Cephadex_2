import { createAsyncThunk } from "@reduxjs/toolkit";
import { QuizService, type QuizSharingFullSchema } from "@source/client";
import { normalize, schema } from "normalizr";

export const fetchSharedQuizzes = createAsyncThunk(
  "quizzes/fetchSharedQuizzes",
  async () => {
    const result = await QuizService.getSharedQuizzesForUser();

    // Normalazing
    const quiz = new schema.Entity<QuizSharingFullSchema>(
      "quizzes",
      undefined,
      {
        idAttribute: (value) => value.quiz.id,
      }
    );
    const mySchema = { quizzes: [quiz] };

    const normalizedData: QuizSharingFullSchema[] = Object.values(
      normalize(result, mySchema).entities.quizzes ?? []
    );
    return normalizedData;
  }
); // TODO: can we return a message here?

export const deleteOneSharedQuiz = createAsyncThunk(
  "quizzes/deleteOneSharedQuiz",
  async (shareId: string) => {
    const result = await QuizService.deleteSharedQuiz(shareId);
    return result;
  }
);
