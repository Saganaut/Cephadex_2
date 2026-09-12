import React, { PropsWithChildren } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { configureStore, type PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

// Import your store configuration
import type { RootState } from '@store/store'
import cardsReducer from '@store/cards/cardsSlice'
import answersReducer from '@store/answers/answersSlice'
import cardInstancesReducer from '@store/cardInstances/cardInstancesSlice'
import cardsHistoryReducer from '@store/cardsHistory/cardsHistorySlice'
import chatbotMessagesReducer from '@store/chatbotMessages/chatbotMessagesSlice'
import deckFilesReducer from '@store/deckFiles/deckFilesSlice'
import decksReducer from '@store/decks/decksSlice'
import gameRoundsReducer from '@store/gameRounds/gameRoundsSlice'
import gamesSliceReducer from '@store/games/gamesSlice'
import groupReducer from '@store/group/groupSlice'
import groupsReducer from '@store/groups/groupsSlice'
import notificationsReducer from '@store/notifications/notificationsSlice'
import playersReducer from '@store/players/playersSlice'
import questionsReducer from '@store/questions/questionsSlice'
import quizzesReducer from '@store/quizzes/quizzesSlice'
import sharedQuizzesSlice from '@store/sharedQuizzes/sharedQuizzesSlice'
import tempQuestionReducer from '@store/tempQuestions/tempQuestionsSlice'
import userReducer from '@store/user/userSlice'
import userSettingsReducer from '@store/userSettings/userSettingsSlice'
import promptDataSlice from '@store/promptData/promptDataSlice'
import quizResultsReducer from '@store/quizResults/quizResultsSlice'
import registrationSlice from '@store/register/registerSlice'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>
  store?: ReturnType<typeof setupStore>
}

// Create a test store without API middleware to avoid network calls during tests
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      decks: decksReducer,
      quizzes: quizzesReducer,
      user: userReducer,
      userSettings: userSettingsReducer,
      cards: cardsReducer,
      answers: answersReducer,
      cardsHistory: cardsHistoryReducer,
      questions: questionsReducer,
      players: playersReducer,
      groups: groupsReducer,
      group: groupReducer,
      chatbotMessages: chatbotMessagesReducer,
      deckFiles: deckFilesReducer,
      cardInstances: cardInstancesReducer,
      notifications: notificationsReducer,
      sharedQuizzes: sharedQuizzesSlice,
      registration: registrationSlice,
      promptData: promptDataSlice,
      quizResults: quizResultsReducer,
      gameRounds: gameRoundsReducer,
      games: gamesSliceReducer,
      tempQuestions: tempQuestionReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

// Create wrapper component with all providers
function AllTheProviders({
  children,
  store,
}: PropsWithChildren<{
  store: ReturnType<typeof setupStore>
}>) {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  )
}

// Custom render function that includes providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>) {
    return <AllTheProviders store={store}>{children}</AllTheProviders>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Create mock initial states for common scenarios
export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  first_name: 'Test',
  last_name: 'User',
  is_premium: false,
  credits: 100,
  ...overrides,
})

export const createMockDeck = (overrides = {}) => ({
  id: 1,
  name: 'Test Deck',
  description: 'A test deck',
  is_public: false,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  user_id: 1,
  cards_count: 5,
  ...overrides,
})

export const createMockCard = (overrides = {}) => ({
  id: 1,
  front: 'What is React?',
  back: 'A JavaScript library for building user interfaces',
  deck_id: 1,
  card_type: 'basic',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
})