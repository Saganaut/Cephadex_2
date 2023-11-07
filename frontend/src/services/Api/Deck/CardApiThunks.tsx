import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchDeckCardsThunk = createAsyncThunk(
  "deckCards/fetchDeckCards",
  async (deckId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/deck_bp/api_0/deck/${deckId}/cards`,
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        console.log("fetchDeckCardsThunk API response data", response.data);
        const deckCardsData = { "deck-id": deckId, cards: response.data.cards };
        console.log(deckCardsData);
        return deckCardsData;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching decks:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export { fetchDeckCardsThunk };
