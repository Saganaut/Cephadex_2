import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  type AnsweredCardData,
  type CardData,
  type CardSchema,
  CardService,
  type StudyCardSchema,
  StudyService,
} from "@source/client";

const cardSchemaToStudyCardSchema = (
  cardSchemaCard: CardSchema,
  batchNumber: number
): StudyCardSchema => {
  const generateId = (): string => Date.now().toString().slice(-4);

  return {
    ...cardSchemaCard,
    batchNumber: batchNumber,
    uniqueId: Number(`${generateId()}${cardSchemaCard.id}`),
  };
};

export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async ({ deckId, page }: { deckId: number; page: string | null }) => {
    const result = await CardService.getCardsForDeck(
      deckId,
      null,
      "Date",
      "desc",
      parseInt(page ?? "1")
    );
    const StudySchemaCards = result.cards?.map((card) =>
      cardSchemaToStudyCardSchema(card, result.pageNumber)
    );
    return {
      cards: StudySchemaCards,
      pageNumber: result.pageNumber,
      totalPages: result.totalPages,
    };
  }
);

interface IDueCardsResponse {
  cards: StudyCardSchema[];
  batchNumber: number;
  message: string;
}
export const fetchDueCards = createAsyncThunk(
  "cards/fetchDueCards",
  async (deckId: number): Promise<IDueCardsResponse> => {
    const result = await StudyService.getCardsDue(deckId, {
      cards: null,
      deckId,
      batchNumber: 0,
      settings: null,
    });
    if (result.message !== "No cards due") {
      return {
        cards: result.cards,
        batchNumber: result.cards[0].batchNumber,
        message: result.message,
      };
    } else {
      return {
        cards: [],
        batchNumber: 0,
        message: result.message,
      };
    }
  }
);

//TODO: Implement or remove per deck settings
export const fetchDueNextCards = createAsyncThunk(
  "cards/fetchDueNextCards",
  async ({
    deckId,
    batchNumber,
    cards,
    settings,
  }: {
    deckId: number;
    cards: AnsweredCardData[];
    batchNumber: number;
    settings: unknown;
  }): Promise<IDueCardsResponse> => {
    const result = await StudyService.getCardsDue(deckId, {
      cards,
      deckId,
      batchNumber,
      settings: null,
    });
    if (result.message !== "No cards due") {
      return {
        cards: result.cards,
        batchNumber: result.cards[0].batchNumber,
        message: result.message,
      };
    } else {
      return {
        cards: [],
        batchNumber: 0,
        message: result.message,
      };
    }
  }
);

export const deleteOneCard = createAsyncThunk(
  "cards/deleteOneCard",
  async ({ deckId, cardId }: { deckId: number; cardId: number }) => {
    try {
      const result = await CardService.deleteCard(deckId, cardId);
      return {
        cardId,
        result,
        message: result.message,
      };
    } catch (error) {
      throw new Error(
        error.message ?? "Something went wrong while deleting the card"
      );
    }
  }
);

export const updateOneCard = createAsyncThunk(
  "cards/updateOneCard",
  async ({
    body,
    deckId,
    cardId,
  }: {
    body: CardData;
    deckId: number;
    cardId: number;
  }) => {
    try {
      const response = await CardService.editCard(deckId, cardId, body);
      return {
        cardId,
        deckId,
        body:
          response.cards != null
            ? response.cards[0]
            : ([] as unknown as CardSchema),
      };
    } catch (error) {
      throw new Error(
        error.message ?? "Something went wrong while updating the card"
      );
    }
  }
);
export const updateOne = createAsyncThunk(
  "cards/updateOne",
  async (card: StudyCardSchema): Promise<StudyCardSchema> => {
    return card;
  }
);

export const regenerateOneCard = createAsyncThunk(
  "cards/regenerateOneCard",
  async ({ deckId, cardId }: { deckId: number; cardId: number }) => {
    try {
      const response = await CardService.regenerateCard(deckId, cardId);
      return {
        cardId,
        message: response.message,
        deckId,
        body:
          response.cards != null
            ? response.cards[0]
            : ([] as unknown as CardSchema),
      };
    } catch (error: unknown) {
      throw new Error(
        error.message ?? "Something went wrong while updating the card"
      );
    }
  }
);
