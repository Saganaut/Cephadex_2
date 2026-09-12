import { configureStore } from '@reduxjs/toolkit'
import cardsReducer from '@source/lib/store/cards/cardsSlice'
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

import api from '../services/cachedApiCalls'
import promptDataSlice from './promptData/promptDataSlice'
import quizResultsReducer from './quizResults/quizResultsSlice'
// import logger from "redux-logger";
import registrationSlice from './register/registerSlice'
import { toastMiddleware } from './toastMiddeware'

export const store = configureStore({
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
        [api.reducerPath]: api.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            // .concat(logger)
            .concat(toastMiddleware)
            .concat(api.middleware),
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
