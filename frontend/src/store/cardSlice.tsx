import { createSlice } from "@reduxjs/toolkit";
import { type Card } from "@source/types/Globals";

const cardsSlice = createSlice({
  name: "cards",
  initialState: [] as Card[],
  reducers: {
    setCards: (state, action) => {
      return action.payload;
    },
  },
});
export const { setCards } = cardsSlice.actions;
export default cardsSlice.reducer;
