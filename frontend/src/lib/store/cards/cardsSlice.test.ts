import { describe, it, expect } from 'vitest'
import cardsReducer from './cardsSlice'
import { fetchCards, createOneCard, editCard } from './actions'
import { logoutUser } from '../user/actions'
import type { CardSchema } from '@source/client'

// Mock card data for testing
const mockCard: CardSchema = {
  id: 1,
  front: 'What is React?',
  back: 'A JavaScript library for building user interfaces',
  deck_id: 1,
  card_type: 'basic',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
}

const mockCard2: CardSchema = {
  id: 2,
  front: 'What is TypeScript?',
  back: 'A typed superset of JavaScript',
  deck_id: 1,
  card_type: 'basic',
  created_at: '2023-01-02T00:00:00.000Z',
  updated_at: '2023-01-02T00:00:00.000Z',
}

describe('cardsSlice', () => {
  const initialState = {
    ids: [],
    entities: {},
    status: 'idle' as const,
    error: '',
    decksLoaded: [],
  }

  describe('reducers', () => {
    it('should handle resetCardsStatus', () => {
      const stateWithError = {
        ...initialState,
        status: 'failed' as const,
        error: 'Some error',
      }

      const action = { type: 'cards/resetCardsStatus' }
      const result = cardsReducer(stateWithError, action)

      expect(result.status).toBe('idle')
      expect(result.error).toBe('')
    })

    it('should handle deleteAllCards', () => {
      const stateWithCards = {
        ids: [1, 2],
        entities: {
          1: mockCard,
          2: mockCard2,
        },
        status: 'succeeded' as const,
        error: '',
        decksLoaded: [1],
      }

      const action = { type: 'cards/deleteAllCards' }
      const result = cardsReducer(stateWithCards, action)

      expect(result.ids).toHaveLength(0)
      expect(result.entities).toEqual({})
    })
  })

  describe('async action handlers', () => {
    describe('fetchCards', () => {
      it('should handle fetchCards.pending', () => {
        const action = { type: fetchCards.pending.type }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('loading')
      })

      it('should handle fetchCards.fulfilled', () => {
        const payload = {
          deckId: 1,
          cards: [mockCard, mockCard2],
        }
        const action = { type: fetchCards.fulfilled.type, payload }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.ids).toHaveLength(2)
        expect(result.entities[1]).toEqual(mockCard)
        expect(result.entities[2]).toEqual(mockCard2)
        expect(result.decksLoaded).toContain(1)
      })

      it('should handle fetchCards.rejected', () => {
        const error = { message: 'Failed to fetch cards' }
        const action = { type: fetchCards.rejected.type, error }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('Failed to fetch cards')
      })

      it('should handle fetchCards.rejected with no error message', () => {
        const error = {}
        const action = { type: fetchCards.rejected.type, error }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('')
      })
    })

    describe('createOneCard', () => {
      it('should handle createOneCard.pending', () => {
        const action = { type: createOneCard.pending.type }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('loading')
      })

      it('should handle createOneCard.fulfilled', () => {
        const payload = { card: mockCard }
        const action = { type: createOneCard.fulfilled.type, payload }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.ids).toContain(1)
        expect(result.entities[1]).toEqual(mockCard)
      })

      it('should handle createOneCard.rejected', () => {
        const error = { message: 'Failed to create card' }
        const action = { type: createOneCard.rejected.type, error }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('Failed to create card')
      })
    })

    describe('editCard', () => {
      it('should handle editCard.pending', () => {
        const action = { type: editCard.pending.type }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('loading')
      })

      it('should handle editCard.fulfilled', () => {
        const stateWithCard = {
          ...initialState,
          ids: [1],
          entities: { 1: mockCard },
        }

        const updatedCard = { ...mockCard, front: 'Updated Question' }
        const payload = { card: updatedCard }
        const action = { type: editCard.fulfilled.type, payload }
        const result = cardsReducer(stateWithCard, action)

        expect(result.status).toBe('succeeded')
        expect(result.entities[1]?.front).toBe('Updated Question')
      })

      it('should handle editCard.rejected', () => {
        const error = { message: 'Failed to edit card' }
        const action = { type: editCard.rejected.type, error }
        const result = cardsReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('Failed to edit card')
      })
    })

    describe('logoutUser', () => {
      it('should reset state on logoutUser.fulfilled', () => {
        const stateWithData = {
          ids: [1, 2],
          entities: {
            1: mockCard,
            2: mockCard2,
          },
          status: 'succeeded' as const,
          error: '',
          decksLoaded: [1, 2],
        }

        const action = { type: logoutUser.fulfilled.type }
        const result = cardsReducer(stateWithData, action)

        expect(result).toEqual(initialState)
        expect(result.ids).toHaveLength(0)
        expect(result.entities).toEqual({})
        expect(result.decksLoaded).toHaveLength(0)
      })
    })
  })

  describe('entity adapter functionality', () => {
    it('should maintain sorted order by id', () => {
      const payload = {
        deckId: 1,
        cards: [mockCard2, mockCard], // Reverse order
      }
      const action = { type: fetchCards.fulfilled.type, payload }
      const result = cardsReducer(initialState, action)

      expect(result.ids).toEqual([1, 2]) // Should be sorted by id
    })

    it('should handle duplicate cards correctly', () => {
      const stateWithCard = {
        ...initialState,
        ids: [1],
        entities: { 1: mockCard },
        decksLoaded: [1],
      }

      const payload = {
        deckId: 1,
        cards: [mockCard], // Same card
      }
      const action = { type: fetchCards.fulfilled.type, payload }
      const result = cardsReducer(stateWithCard, action)

      expect(result.ids).toHaveLength(1)
      expect(result.entities[1]).toEqual(mockCard)
    })

    it('should track decks loaded correctly', () => {
      let result = cardsReducer(initialState, {
        type: fetchCards.fulfilled.type,
        payload: { deckId: 1, cards: [mockCard] },
      })

      expect(result.decksLoaded).toEqual([1])

      result = cardsReducer(result, {
        type: fetchCards.fulfilled.type,
        payload: { deckId: 2, cards: [mockCard2] },
      })

      expect(result.decksLoaded).toEqual([1, 2])
    })

    it('should not duplicate deck ids in decksLoaded', () => {
      const stateWithLoadedDeck = {
        ...initialState,
        decksLoaded: [1],
      }

      const payload = {
        deckId: 1,
        cards: [mockCard2],
      }
      const action = { type: fetchCards.fulfilled.type, payload }
      const result = cardsReducer(stateWithLoadedDeck, action)

      expect(result.decksLoaded).toEqual([1])
    })
  })

  describe('state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = { ...initialState }
      const payload = { card: mockCard }
      const action = { type: createOneCard.fulfilled.type, payload }

      cardsReducer(initialState, action)

      expect(initialState).toEqual(originalState)
    })

    it('should create new state objects', () => {
      const payload = { card: mockCard }
      const action = { type: createOneCard.fulfilled.type, payload }
      const result = cardsReducer(initialState, action)

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

      const payload = { card: mockCard }
      const action = { type: createOneCard.fulfilled.type, payload }
      const result = cardsReducer(stateWithError, action)

      expect(result.error).toBe('')
      expect(result.status).toBe('succeeded')
    })

    it('should preserve previous data on error', () => {
      const stateWithData = {
        ids: [1],
        entities: { 1: mockCard },
        status: 'succeeded' as const,
        error: '',
        decksLoaded: [1],
      }

      const error = { message: 'Network error' }
      const action = { type: fetchCards.rejected.type, error }
      const result = cardsReducer(stateWithData, action)

      expect(result.ids).toEqual([1])
      expect(result.entities[1]).toEqual(mockCard)
      expect(result.decksLoaded).toEqual([1])
      expect(result.error).toBe('Network error')
      expect(result.status).toBe('failed')
    })
  })

  describe('edge cases', () => {
    it('should handle unknown action types', () => {
      const unknownAction = { type: 'unknown/action' }
      const result = cardsReducer(initialState, unknownAction)

      expect(result).toEqual(initialState)
    })

    it('should handle cards with same id from different decks', () => {
      const cardFromDeck2 = { ...mockCard, deck_id: 2 }

      let result = cardsReducer(initialState, {
        type: fetchCards.fulfilled.type,
        payload: { deckId: 1, cards: [mockCard] },
      })

      result = cardsReducer(result, {
        type: fetchCards.fulfilled.type,
        payload: { deckId: 2, cards: [cardFromDeck2] },
      })

      // Should update the card (same id) but track both decks
      expect(result.ids).toEqual([1])
      expect(result.entities[1]?.deck_id).toBe(2)
      expect(result.decksLoaded).toEqual([1, 2])
    })

    it('should handle empty cards array', () => {
      const payload = {
        deckId: 1,
        cards: [],
      }
      const action = { type: fetchCards.fulfilled.type, payload }
      const result = cardsReducer(initialState, action)

      expect(result.status).toBe('succeeded')
      expect(result.ids).toHaveLength(0)
      expect(result.decksLoaded).toEqual([1])
    })

    it('should handle cards with zero id', () => {
      const cardWithZeroId = { ...mockCard, id: 0 }
      const payload = { card: cardWithZeroId }
      const action = { type: createOneCard.fulfilled.type, payload }
      const result = cardsReducer(initialState, action)

      expect(result.ids).toContain(0)
      expect(result.entities[0]).toEqual(cardWithZeroId)
    })
  })

  describe('different card types', () => {
    it('should handle different card types correctly', () => {
      const mcqCard: CardSchema = {
        ...mockCard,
        id: 3,
        card_type: 'mcq',
        front: 'Multiple choice question',
      }

      const payload = { card: mcqCard }
      const action = { type: createOneCard.fulfilled.type, payload }
      const result = cardsReducer(initialState, action)

      expect(result.entities[3]?.card_type).toBe('mcq')
    })

    it('should handle cards with complex content', () => {
      const complexCard: CardSchema = {
        ...mockCard,
        id: 4,
        front: '# Question with Markdown\n\n- List item 1\n- List item 2',
        back: '**Bold answer** with *italic* text',
      }

      const payload = { card: complexCard }
      const action = { type: createOneCard.fulfilled.type, payload }
      const result = cardsReducer(initialState, action)

      expect(result.entities[4]?.front).toContain('# Question with Markdown')
      expect(result.entities[4]?.back).toContain('**Bold answer**')
    })
  })
})