import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    type NewQuizRequest,
    type QuizRequestSchema,
    QuizService,
    type QuizSharedDataResponse,
} from '@source/client'

export const fetchQuizzes = createAsyncThunk(
    'quizzes/fetchQuizzes',
    async () => {
        const result = await QuizService.getAllCreatedQuizzes()
        return result
    }
)

export const deleteOneQuiz = createAsyncThunk(
    'quizzes/deleteOneQuiz',
    async (quizId: number) => {
        const result = await QuizService.deleteQuiz(quizId)
        return {
            quizId,
            result,
            message: result.message,
        }
    }
)

export const updateOneQuiz = createAsyncThunk(
    'quizzes/updateOneQuiz',
    async ({ quizId, quiz }: { quizId: number; quiz: QuizRequestSchema }) => {
        const result = await QuizService.updateQuiz(quizId, quiz)
        return result
    }
)

export const getQuizAndQuestions = createAsyncThunk(
    'quizzes/getQuizAndQuestions',
    async (quizId: number) => {
        const result = await QuizService.getQuizAndQuestions(quizId)
        return result
    }
)

export const createOneNewQuiz = createAsyncThunk(
    'quizzes/createOneNewQuiz',
    async (quiz: NewQuizRequest) => {
        const result = await QuizService.createNewQuiz(quiz)
        return result
    }
)

export const getOneSharedQuiz = createAsyncThunk<
    QuizSharedDataResponse,
    string
>('quizzes/getOneSharedQuiz', async (quizShareId: string) => {
    const result = await QuizService.getSharedQuiz(quizShareId)
    return result
})
