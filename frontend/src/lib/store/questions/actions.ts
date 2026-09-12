import { createAction, type EntityId } from '@reduxjs/toolkit'
import type { QuestionSchema } from '@source/client'

export const addOneQuestion = createAction<QuestionSchema>(
    'questions/addOneQuestion'
)
export const addManyQuestions = createAction<{
    questions: QuestionSchema[]
    remove: boolean
}>('questions/addManyQuestions')

export const updateOneQuestion = createAction<{
    id: EntityId
    changes: Partial<{ points: number }>
}>('questions/updateOneQuestion')

export const setQuestions = createAction<QuestionSchema[]>(
    'questions/setQuestions'
)

export const updateManyQuestions = createAction<
    Array<{
        id: EntityId
        changes: Partial<{ qOrder: number }>
    }>
>('questions/updateManyQuestions')

export const clearQuestions = createAction('questions/clearQuestions')
