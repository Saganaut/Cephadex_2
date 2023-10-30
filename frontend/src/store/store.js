import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from 'store/cardSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
  },
});