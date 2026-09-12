import { describe, it, expect } from 'vitest'
import decksReducer from './decksSlice'
import { fetchDecks, deleteOneDeck, updateOneDeck } from './actions'
import { logoutUser } from '../user/actions'
import type { DeckSchema } from '@source/client'

// Mock deck data for testing
const mockDeck: DeckSchema = {
  id: 1,
  name: 'Test Deck',
  description: 'A test deck',
  is_public: false,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  user_id: 1,
  cards_count: 5,
}

const mockDeck2: DeckSchema = {
  id: 2,
  name: 'Test Deck 2',
  description: 'Another test deck',
  is_public: true,
  created_at: '2023-01-02T00:00:00.000Z',
  updated_at: '2023-01-02T00:00:00.000Z',
  user_id: 1,
  cards_count: 3,
}

describe('decksSlice', () => {
  const initialState = {
    ids: [],
    entities: {},
    status: 'idle' as const,
    error: '',
    allDecksLoaded: false,
    decksLoaded: [],
  }

  describe('async action handlers', () => {
    describe('fetchDecks', () => {
      it('should handle fetchDecks.pending', () => {
        const action = { type: fetchDecks.pending.type }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('loading')
        expect(result.error).toBe('')
      })

      it('should handle fetchDecks.fulfilled', () => {
        const payload = { decks: [mockDeck, mockDeck2] }
        const action = { type: fetchDecks.fulfilled.type, payload }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.allDecksLoaded).toBe(true)
        expect(result.ids).toHaveLength(2)
        expect(result.entities[1]).toEqual(mockDeck)
        expect(result.entities[2]).toEqual(mockDeck2)
      })

      it('should handle fetchDecks.rejected', () => {
        const error = { message: 'Failed to fetch decks' }
        const action = { type: fetchDecks.rejected.type, error }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('Failed to fetch decks')
        expect(result.allDecksLoaded).toBe(false)
      })

      it('should handle fetchDecks.rejected with no error message', () => {
        const error = {}
        const action = { type: fetchDecks.rejected.type, error }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('')
      })
    })

    describe('deleteOneDeck', () => {
      it('should handle deleteOneDeck.fulfilled', () => {
        const stateWithDecks = {
          ...initialState,
          ids: [1, 2],
          entities: {
            1: mockDeck,
            2: mockDeck2,
          },
        }

        const payload = { id: 1 }
        const action = { type: deleteOneDeck.fulfilled.type, payload }
        const result = decksReducer(stateWithDecks, action)

        expect(result.status).toBe('succeeded')
        expect(result.ids).toHaveLength(1)
        expect(result.ids).toEqual([2])
        expect(result.entities[1]).toBeUndefined()
        expect(result.entities[2]).toEqual(mockDeck2)
      })

      it('should handle deleteOneDeck.pending', () => {
        const action = { type: deleteOneDeck.pending.type }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('loading')
      })

      it('should handle deleteOneDeck.rejected', () => {
        const error = { message: 'Failed to delete deck' }
        const action = { type: deleteOneDeck.rejected.type, error }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('Failed to delete deck')
      })
    })

    describe('updateOneDeck', () => {
      it('should handle updateOneDeck.fulfilled', () => {
        const stateWithDeck = {
          ...initialState,
          ids: [1],
          entities: {
            1: mockDeck,
          },
        }

        const updatedDeck = { ...mockDeck, name: 'Updated Deck Name' }
        const payload = { deck: updatedDeck }
        const action = { type: updateOneDeck.fulfilled.type, payload }
        const result = decksReducer(stateWithDeck, action)

        expect(result.status).toBe('succeeded')
        expect(result.entities[1]?.name).toBe('Updated Deck Name')
        expect(result.entities[1]?.description).toBe(mockDeck.description)
      })

      it('should handle updateOneDeck.pending', () => {
        const action = { type: updateOneDeck.pending.type }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('loading')
      })

      it('should handle updateOneDeck.rejected', () => {
        const error = { message: 'Failed to update deck' }
        const action = { type: updateOneDeck.rejected.type, error }
        const result = decksReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('Failed to update deck')
      })
    })

    describe('logoutUser', () => {
      it('should reset state on logoutUser.fulfilled', () => {
        const stateWithData = {
          ids: [1, 2],
          entities: {
            1: mockDeck,
            2: mockDeck2,
          },
          status: 'succeeded' as const,
          error: '',
          allDecksLoaded: true,
          decksLoaded: [1, 2],
        }

        const action = { type: logoutUser.fulfilled.type }
        const result = decksReducer(stateWithData, action)

        expect(result).toEqual(initialState)
        expect(result.ids).toHaveLength(0)
        expect(result.entities).toEqual({})
        expect(result.allDecksLoaded).toBe(false)
        expect(result.decksLoaded).toHaveLength(0)
      })
    })
  })

  describe('entity adapter functionality', () => {
    it('should maintain sorted order by id', () => {
      const payload = { decks: [mockDeck2, mockDeck] } // Reverse order
      const action = { type: fetchDecks.fulfilled.type, payload }
      const result = decksReducer(initialState, action)

      expect(result.ids).toEqual([1, 2]) // Should be sorted by id
    })

    it('should handle duplicate entities correctly', () => {
      const stateWithDeck = {
        ...initialState,
        ids: [1],
        entities: {
          1: mockDeck,
        },
      }

      const payload = { decks: [mockDeck] } // Same deck
      const action = { type: fetchDecks.fulfilled.type, payload }
      const result = decksReducer(stateWithDeck, action)

      expect(result.ids).toHaveLength(1)
      expect(result.entities[1]).toEqual(mockDeck)
    })
  })

  describe('state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = { ...initialState }
      const payload = { decks: [mockDeck] }
      const action = { type: fetchDecks.fulfilled.type, payload }

      decksReducer(initialState, action)

      expect(initialState).toEqual(originalState)
    })

    it('should create new state objects', () => {
      const payload = { decks: [mockDeck] }
      const action = { type: fetchDecks.fulfilled.type, payload }
      const result = decksReducer(initialState, action)

      expect(result).not.toBe(initialState)
      expect(result.entities).not.toBe(initialState.entities)
      expect(result.ids).not.toBe(initialState.ids)
    })
  })

  describe('error handling', () => {
    it('should clear error on successful actions', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error',
        status: 'failed' as const,
      }

      const payload = { decks: [mockDeck] }
      const action = { type: fetchDecks.fulfilled.type, payload }
      const result = decksReducer(stateWithError, action)

      expect(result.error).toBe('')
      expect(result.status).toBe('succeeded')
    })

    it('should preserve previous data on error', () => {
      const stateWithData = {
        ids: [1],
        entities: {
          1: mockDeck,
        },
        status: 'succeeded' as const,
        error: '',
        allDecksLoaded: true,
        decksLoaded: [1],
      }

      const error = { message: 'Network error' }
      const action = { type: fetchDecks.rejected.type, error }
      const result = decksReducer(stateWithData, action)

      expect(result.ids).toEqual([1])
      expect(result.entities[1]).toEqual(mockDeck)
      expect(result.error).toBe('Network error')
      expect(result.status).toBe('failed')
    })
  })
})