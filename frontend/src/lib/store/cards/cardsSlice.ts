import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
} from "@reduxjs/toolkit";
import type { CardSchema } from "@source/client";
import type { RootState } from "@store/store";

import { deleteOneCard, updateOne } from "../cardInstances/actions";
import { fetchSharedDeck } from "../decks/actions";
import { logoutUser } from "../user/actions";
import {
  copyCardToDeck,
  createOneCard,
  editCard,
  fetchCards,
  generateNewCards,
  importCardsFromAnki,
  importCardsFromCSV,
  importCardsFromOtherDecks,
  regenerateOneCard,
} from "./actions";

const cardsAdapter = createEntityAdapter<CardSchema>({
  selectId: (card) => card.id,
  sortComparer: (a, b) => a.id - b.id,
});

interface CardSliceState extends EntityState<CardSchema> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
  decksLoaded: number[];
}

const initialState: CardSliceState = cardsAdapter.getInitialState({
  status: "idle",
  error: "",
  decksLoaded: [],
});
const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    resetCardsStatus: (state) => {
      state.status = "idle";
      state.error = "";
    },
    deleteAllCards: (state) => {
      cardsAdapter.removeAll(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        const { deckId, cards } = action.payload;
        state.status = "succeeded";
        if (cards == null) return;
        cardsAdapter.upsertMany(state, cards);
        state.decksLoaded.push(deckId);
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      //   DELETE ONE CARD
      .addCase(deleteOneCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardsAdapter.removeOne(state, action.payload.cardId);
      })
      .addCase(deleteOneCard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      //   UPDATE ONE CARD
      .addCase(updateOne.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCard = action.payload;
        cardsAdapter.setOne(state, updatedCard);
      })
      .addCase(updateOne.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(fetchSharedDeck.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardsAdapter.upsertMany(state, action.payload.cards as CardSchema[]);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        cardsAdapter.removeAll(state);
        state.status = "idle";
        state.decksLoaded = [];
      })
      .addCase(createOneCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.cards != null && action.payload.cards.length > 0) {
          cardsAdapter.addOne(state, action.payload.cards[0]);
        }
      })
      .addCase(generateNewCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardsAdapter.upsertMany(state, action.payload.cards!);
      })
      .addCase(regenerateOneCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardsAdapter.upsertOne(state, action.payload.body);
      })
      .addCase(importCardsFromAnki.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardsAdapter.upsertMany(state, action.payload.cards!);
      })
      .addCase(importCardsFromCSV.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardsAdapter.upsertMany(state, action.payload.cards!);
      })
      .addCase(importCardsFromOtherDecks.fulfilled, (state, action) => {
        state.status = "succeeded";
        cardsAdapter.upsertMany(state, action.payload.cards!);
      })
      .addCase(copyCardToDeck.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload.cards != null &&
          cardsAdapter.upsertMany(state, action.payload.cards);
      })
      .addCase(editCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.cards != null && action.payload.cards.length > 0)
          cardsAdapter.upsertOne(state, action.payload.cards[0]);
      });
  },
});

export default cardsSlice.reducer;
export const {
  selectAll: selectAllCards,
  selectById: selectCardsById,
  selectIds: selectCardIds,
} = cardsAdapter.getSelectors((state: RootState) => state.cards);
export const { resetCardsStatus, deleteAllCards } = cardsSlice.actions;
export const selectCardsByDeckId = createSelector(
  [selectAllCards, (state, deckId) => deckId],
  (cards, deckId) => {
    const filteredCards = cards.filter((card) => card.deckId === deckId);

    return filteredCards;
  }
);
