import { createAsyncThunk } from "@reduxjs/toolkit";
import { QuizService } from "@source/client";

export const deleteOneQuizResult = createAsyncThunk(
  "quizResults/deleteOneQuizResult",
  async (resultId: number) => {
    const result = await QuizService.deleteQuizResult(resultId);
    return {
      resultId,
      result,
      message: result.message,
    };
  }
);

export const getResultsForQuiz = createAsyncThunk(
  "quizResults/getResultsForQuiz",
  async (quizId: number) => {
    const result = await QuizService.getUserResultsForQuiz(quizId);
    return result;
  }
);

export const getMyResults = createAsyncThunk(
  "quizResults/getMyResults",
  async () => {
    const result = await QuizService.getMyResults();
    return result;
  }
);

export const getAssignedResults = createAsyncThunk(
  "quizResults/getAssignedResults",
  async () => {
    const result = await QuizService.getAssignedResults();
    return result;
  }
);

export const getOneQuizResult = createAsyncThunk(
  "quizResults/getOneQuizResult",

  async ({ resultId, userId }: { resultId: number; userId: number }) => {
    const result = await QuizService.getQuizResult(resultId, userId);
    return result;
  }
);
