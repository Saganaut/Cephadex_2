import { createSlice } from "@reduxjs/toolkit";
import { type DeckCards } from "@customTypes/Deck";
import { type Card } from "@customTypes/Deck";

import { fetchDeckCardsThunk } from "@services/Api/Deck/CardApiThunks";

interface DecksState {
  deckCards: {
    "deck-id": number;
    cards: Card[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: DecksState = {
  deckCards: null,
  loading: false,
  error: null,
};

const deckCardsSlice = createSlice({
  name: "deckCards",
  initialState,
  reducers: {
    setDeckCards: (state, action) => {
      state.deckCards = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeckCardsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeckCardsThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.deckCards = action.payload;
      })
      .addCase(fetchDeckCardsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setDeckCards } = deckCardsSlice.actions;
export default deckCardsSlice.reducer;
