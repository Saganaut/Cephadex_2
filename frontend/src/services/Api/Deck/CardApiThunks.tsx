import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logger } from "@source/Lib/utils/Logger";

const fetchDeckCardsThunk = createAsyncThunk(
  "deckCards/fetchDeckCards",
  async (deckId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/deck_bp/api_0/deck/${deckId}/cards`,
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        const deckCardsData = { "deck-id": deckId, cards: response.data.cards };
        return deckCardsData;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      logger.error("An error occurred while fetching decks:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export { fetchDeckCardsThunk };
