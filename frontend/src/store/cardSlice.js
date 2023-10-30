import { createSlice } from '@reduxjs/toolkit';

 const cardsSlice = createSlice({
  name: 'cards',
  initialState: [],
  reducers: {
    setCards: (state, action) => {
      return action.payload;
    },
  },
});
export const { setCards } = cardsSlice.actions;
export default cardsSlice.reducer;
