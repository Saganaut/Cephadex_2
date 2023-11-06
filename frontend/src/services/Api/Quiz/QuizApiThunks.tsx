import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuizzesThunk = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/quiz_bp/api_0/quizzes",
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        console.log(response.data);
        return response.data["Quizzes"].map((quiz) => ({
          ...quiz,
          type: "Quiz",
        }));
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching Quizzes:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
