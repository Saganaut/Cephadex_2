import { describe, it, expect } from 'vitest'
import userReducer, { setUser, type UserState } from './userSlice'
import { checkUserAuth, fetchUser, logoutUser, subscribeToNewsletter, unsubscribeFromNewsletter } from './actions'

// Mock user data for testing
const mockUser = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  first_name: 'Test',
  last_name: 'User',
  is_premium: false,
  credits: 100,
  subscriber: false,
  contactedEmail: true,
}

describe('userSlice', () => {
  const initialState: UserState = {
    user: null,
    status: 'idle',
    error: '',
  }

  describe('reducers', () => {
    it('should handle setUser', () => {
      const action = setUser(mockUser)
      const result = userReducer(initialState, action)

      expect(result.user).toEqual(mockUser)
      expect(result.status).toBe('idle')
      expect(result.error).toBe('')
    })

    it('should handle setUser with null', () => {
      const stateWithUser: UserState = {
        ...initialState,
        user: mockUser,
      }
      const action = setUser(null)
      const result = userReducer(stateWithUser, action)

      expect(result.user).toBeNull()
    })
  })

  describe('async action handlers', () => {
    describe('fetchUser', () => {
      it('should handle fetchUser.pending', () => {
        const action = { type: fetchUser.pending.type }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('loading')
        expect(result.user).toBeNull()
        expect(result.error).toBe('')
      })

      it('should handle fetchUser.fulfilled', () => {
        const payload = { user: mockUser }
        const action = { type: fetchUser.fulfilled.type, payload }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.user).toEqual(mockUser)
        expect(result.error).toBe('')
      })

      it('should handle fetchUser.fulfilled with undefined user', () => {
        const payload = { user: undefined }
        const action = { type: fetchUser.fulfilled.type, payload }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.user).toBeNull()
      })
    })

    describe('checkUserAuth', () => {
      it('should handle checkUserAuth.pending', () => {
        const action = { type: checkUserAuth.pending.type }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('loading')
        expect(result.error).toBe('')
      })

      it('should handle checkUserAuth.fulfilled', () => {
        const payload = { user: mockUser }
        const action = { type: checkUserAuth.fulfilled.type, payload }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.user).toEqual(mockUser)
        expect(result.error).toBe('')
      })

      it('should handle checkUserAuth.rejected', () => {
        const error = { message: 'Authentication failed' }
        const action = { type: checkUserAuth.rejected.type, error }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('Authentication failed')
        expect(result.user).toBeNull()
      })

      it('should handle checkUserAuth.rejected with no error message', () => {
        const error = {}
        const action = { type: checkUserAuth.rejected.type, error }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('failed')
        expect(result.error).toBe('')
      })
    })

    describe('logoutUser', () => {
      it('should handle logoutUser.fulfilled', () => {
        const stateWithUser: UserState = {
          user: mockUser,
          status: 'succeeded',
          error: '',
        }
        const action = { type: logoutUser.fulfilled.type }
        const result = userReducer(stateWithUser, action)

        expect(result.user).toBeNull()
        expect(result.status).toBe('idle')
        expect(result.error).toBe('')
      })
    })

    describe('newsletter subscription', () => {
      it('should handle subscribeToNewsletter.fulfilled', () => {
        const stateWithUser: UserState = {
          user: { ...mockUser, subscriber: false },
          status: 'idle',
          error: '',
        }
        const action = { type: subscribeToNewsletter.fulfilled.type }
        const result = userReducer(stateWithUser, action)

        expect(result.status).toBe('succeeded')
        expect(result.user?.subscriber).toBe(true)
      })

      it('should handle subscribeToNewsletter.fulfilled with no user', () => {
        const action = { type: subscribeToNewsletter.fulfilled.type }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.user).toBeNull()
      })

      it('should handle unsubscribeFromNewsletter.fulfilled', () => {
        const stateWithUser: UserState = {
          user: { ...mockUser, subscriber: true },
          status: 'idle',
          error: '',
        }
        const action = { type: unsubscribeFromNewsletter.fulfilled.type }
        const result = userReducer(stateWithUser, action)

        expect(result.status).toBe('succeeded')
        expect(result.user?.subscriber).toBe(false)
      })

      it('should handle unsubscribeFromNewsletter.fulfilled with no user', () => {
        const action = { type: unsubscribeFromNewsletter.fulfilled.type }
        const result = userReducer(initialState, action)

        expect(result.status).toBe('succeeded')
        expect(result.user).toBeNull()
      })
    })
  })

  describe('state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = { ...initialState }
      const action = setUser(mockUser)

      userReducer(initialState, action)

      expect(initialState).toEqual(originalState)
    })

    it('should create new state objects', () => {
      const action = setUser(mockUser)
      const result = userReducer(initialState, action)

      expect(result).not.toBe(initialState)
      expect(result.user).toBe(mockUser) // Reference should be the same for the payload
    })
  })

  describe('edge cases', () => {
    it('should handle unknown action types', () => {
      const unknownAction = { type: 'unknown/action' }
      const result = userReducer(initialState, unknownAction)

      expect(result).toEqual(initialState)
    })

    it('should maintain state structure with partial updates', () => {
      const stateWithUser: UserState = {
        user: mockUser,
        status: 'succeeded',
        error: 'previous error',
      }

      const action = { type: fetchUser.pending.type }
      const result = userReducer(stateWithUser, action)

      expect(result.user).toEqual(mockUser) // User should remain
      expect(result.status).toBe('loading') // Status should update
      expect(result.error).toBe('previous error') // Error should remain
    })
  })
})