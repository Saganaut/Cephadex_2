import { createAsyncThunk } from '@reduxjs/toolkit'
import { DeckService } from '@source/client'

export const fetchDeckFiles = createAsyncThunk(
    'decks/fetchDeckFiles',
    async (deckId: number) => {
        const result = await DeckService.getFiles(deckId)
        return { deckId, result, message: result.message }
    }
)

export const deleteOneDeckFile = createAsyncThunk(
    'decks/deleteOneDeckFile',
    async ({ deckId, fileId }: { deckId: number; fileId: number }) => {
        const result = await DeckService.deleteFile(deckId, fileId)
        return {
            deckId,
            result,
            fileId,
            message: result.message,
        }
    }
)

export const getOneFile = createAsyncThunk(
    'decks/getOneFile',
    async (fileId: number) => {
        const result = await DeckService.getSingleFile(fileId)
        return result
    }
)
// TODO make the back end endpoint
// export const updateOneDeckFile = createAsyncThunk(
//   "decks/updateOneDeckFile",
//   async ({ body, deckId }: { body: UpdateDeckRequest; deckId: number }) => {
//     await DeckService.updateDeck(deckId, body);
//     return {
//       deckId,
//       body,
//     };
//   }
// );

export const renameOneFile = createAsyncThunk(
    'decks/renameOneFile',
    async ({
        deckId,
        fileId,
        name,
    }: {
        deckId: number
        fileId: number
        name: string
    }) => {
        const result = await DeckService.renameFile(deckId, fileId, name)
        return {
            deckId,
            fileId,
            name,
            message: result.message,
        }
    }
)
