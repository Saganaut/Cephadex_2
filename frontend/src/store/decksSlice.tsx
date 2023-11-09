import { createSlice } from "@reduxjs/toolkit";
import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";
import { type Deck } from "@source/types/Deck";

interface DecksState {
  decks: Deck[];
  loading: boolean;
  error: string | null;
}

const initialState: DecksState = {
  decks: [],
  loading: false,
  error: null,
};

const decksSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    setDecks: (state, action) => {
      state.decks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecksThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDecksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.decks = action.payload;
      })
      .addCase(fetchDecksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setDecks } = decksSlice.actions;
export default decksSlice.reducer;
