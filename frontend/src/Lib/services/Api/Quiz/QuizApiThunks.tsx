import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logger } from "@utils/Logger";

export const fetchQuizzesThunk = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/quiz_bp/api_0/quizzes",
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        return response.data["quizzes"].map((quiz) => ({
          ...quiz,
          type: "Quiz",
        }));
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      logger.error("An error occured in fetchQuizzesThunk:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
