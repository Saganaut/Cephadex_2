import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { QuestionSchema } from '@source/client'
import api from '@source/lib/services/cachedApiCalls'

import type { FetchCardsParams } from '../cards/actions'
import type { TempQuestionSchema } from './tempQuestionsSlice'

export const clearAllTempQuestions = createAction('questions/clearAllQuestions')

export const fetchCardsAndTurnToTempQuestions = createAsyncThunk(
    'cards/fetchCards',
    async (params: FetchCardsParams, { dispatch, getState }) => {
        const result = await dispatch(
            api.endpoints.getCardsForDeck.initiate(params)
        )
        return result.data
    }
)

export const addOneTempQuestion = createAction(
    'questions/addOneQuestion',
    (question: TempQuestionSchema) => {
        return {
            payload: question,
        }
    }
)
export const addManyTempQuestions = createAction(
    'questions/addManyQuestions',
    (questions: TempQuestionSchema[]) => {
        return {
            payload: {
                questions,
            },
        }
    }
)

export const updateOneTempQuestion = createAction(
    'questions/updateOneTempQuestion',
    (question: TempQuestionSchema) => {
        return {
            payload: question,
        }
    }
)

export const updateManyTempQuestions = createAction(
    'questions/updateManyTempQuestions',
    (questions: TempQuestionSchema[]) => {
        return {
            payload: questions,
        }
    }
)

export const toggleSelected = createAction(
    'questions/toggleSelected',
    (id: number) => {
        return {
            payload: id,
        }
    }
)

export const toggleAllTempQuestionsSelected = createAction(
    'questions/toggleAllSelected',
    (selected: boolean) => {
        return {
            payload: selected,
        }
    }
)

export const setTempQuestions = createAction<QuestionSchema[]>(
    'questions/setQuestions'
)

export const clearTempQuestions = createAction('questions/clearQuestions')
