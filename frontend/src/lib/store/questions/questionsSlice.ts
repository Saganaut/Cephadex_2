import type { QuestionSchema } from '@client/index'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@store/store'

import { createOneNewQuiz } from '../quizzes/actions'
import { logoutUser } from '../user/actions'
import {
    addManyQuestions,
    addOneQuestion,
    clearQuestions,
    setQuestions,
    updateManyQuestions,
    updateOneQuestion,
} from './actions'

const questionsAdapter = createEntityAdapter<QuestionSchema>({
    sortComparer: (a, b) => (a.qOrder ?? 1) - (b.qOrder ?? 2),
})

const initialState = questionsAdapter.getInitialState({
    status: 'idle',
    error: '',
})

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(addOneQuestion, (state, action) => {
                if (
                    action.payload.id != null &&
                    state.entities[action.payload.id] != null
                ) {
                    questionsAdapter.removeOne(state, action.payload.id)
                } else {
                    questionsAdapter.upsertOne(state, action.payload)
                }
                state.status = 'succeeded'
            })
            .addCase(updateOneQuestion, (state, action) => {
                questionsAdapter.updateOne(state, action.payload)
            })
            .addCase(addManyQuestions, (state, action) => {
                if (action.payload.remove) {
                    questionsAdapter.removeAll(state)
                    state.status = 'succeeded'
                } else {
                    questionsAdapter.upsertMany(state, action.payload.questions)
                    state.status = 'succeeded'
                }
            })
            .addCase(setQuestions, (state, action) => {
                questionsAdapter.setAll(state, action.payload)
            })
            .addCase(updateManyQuestions, (state, action) => {
                questionsAdapter.updateMany(state, action.payload)
            })
            .addCase(clearQuestions, (state) => {
                questionsAdapter.removeAll(state)
            })
            .addCase(logoutUser.fulfilled, (state) => {
                questionsAdapter.removeAll(state)
                state.status = 'idle'
            })
            .addCase(createOneNewQuiz.fulfilled, (state, action) => {
                questionsAdapter.upsertMany(state, action.payload.questions)
            })
    },
})

export default questionsSlice.reducer
export const {
    selectAll: selectAllQuestions,
    selectById: selectQuestionById,
    selectIds: selectQuestionsIds,
} = questionsAdapter.getSelectors((state: RootState) => state.questions)
