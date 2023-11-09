import { createAsyncThunk } from "@reduxjs/toolkit";
import { logger } from "@source/Lib/utils/Logger";
import axios from "axios";

export const fetchDecksThunk = createAsyncThunk(
  "decks/fetchDecks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/deck_bp/api_0/decks",
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        return response.data.decks.map((deck) => ({
          ...deck,
          type: "Deck",
        }));
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      logger.error("An error occurred while fetching decks:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
