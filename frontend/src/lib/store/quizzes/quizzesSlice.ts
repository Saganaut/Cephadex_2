import {
    createEntityAdapter,
    createSelector,
    createSlice,
    type EntityState,
    type PayloadAction,
} from '@reduxjs/toolkit'
import type {
    QuestionRequestSchema,
    QuestionResultData,
    QuestionSchema,
    QuizSchema,
} from '@source/client'
import type { RootState } from '@store/store'

import { logoutUser } from '../user/actions'
import {
    createOneNewQuiz,
    deleteOneQuiz,
    fetchQuizzes,
    getOneSharedQuiz,
    getQuizAndQuestions,
    updateOneQuiz,
} from './actions'

const quizzesAdapter = createEntityAdapter<QuizAndQuestionsSchema>({
    selectId: (quizAndQuestions) => quizAndQuestions.quiz.id,
    sortComparer: (a, b) => a.quiz.id - b.quiz.id,
})

interface QuizAndQuestionsSchema {
    quiz: QuizSchema
    questions?: QuestionSchema[] | null
}

interface QuizzesSliceState extends EntityState<QuizAndQuestionsSchema> {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string
    questions: QuestionRequestSchema[]
    answers: QuestionResultData[]
}

const initialState: QuizzesSliceState = quizzesAdapter.getInitialState({
    status: 'idle',
    error: '',
    questions: [] as QuestionRequestSchema[],
    answers: [] as QuestionResultData[], // this for the taking the quiz
})
const quizzesSlice = createSlice({
    name: 'quizzes',
    initialState,
    reducers: {
        addAnswerToQuiz: (state, action: PayloadAction<QuestionResultData>) => {
            const newAnswer = action.payload
            const existingAnswerIndex = state.answers.findIndex(
                (answer) => answer.questionId === newAnswer.questionId
            )

            if (existingAnswerIndex !== -1) {
                state.answers[existingAnswerIndex] = newAnswer
            } else {
                state.answers.push(newAnswer)
            }
        },
        clearAnswers: (state) => {
            state.answers = []
        },
    },

    extraReducers: (builder) => {
        builder
            //   FETCH ALL quizzes
            .addCase(fetchQuizzes.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.quizzes != null) {
                    const quizAndQuestionsArray = action.payload.quizzes.map(
                        (quiz: QuizSchema) => ({
                            quiz,
                            questions: null,
                        })
                    )

                    quizzesAdapter.upsertMany(state, quizAndQuestionsArray)
                }
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? ''
            })

            //   DELETE ONE QUIZ
            .addCase(deleteOneQuiz.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteOneQuiz.fulfilled, (state, action) => {
                state.status = 'succeeded'
                quizzesAdapter.removeOne(state, action.payload.quizId)
            })
            .addCase(logoutUser.fulfilled, (state) => {
                quizzesAdapter.removeAll(state)
                state.status = 'idle'
            })
            .addCase(createOneNewQuiz.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.quizzes?.[0] != null) {
                    quizzesAdapter.upsertOne(state, {
                        quiz: action.payload.quizzes[0],
                    })
                }
            })
            .addCase(updateOneQuiz.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.quizzes?.[0] != null) {
                    quizzesAdapter.upsertOne(state, {
                        quiz: action.payload.quizzes[0],
                        questions: action.payload.questions,
                    })
                }
            })
            .addCase(getOneSharedQuiz.fulfilled, (state, action) => {
                if (action.payload.data != null) {
                    quizzesAdapter.upsertOne(state, {
                        quiz: action.payload.data.quiz,
                    })
                }
            })
            .addCase(getQuizAndQuestions.fulfilled, (state, action) => {
                if (action.payload.quizzes != null) {
                    quizzesAdapter.upsertOne(state, {
                        quiz: action.payload.quizzes[0],
                        questions: action.payload.questions,
                    })
                }
            })
    },
})

export const { addAnswerToQuiz, clearAnswers } = quizzesSlice.actions

export default quizzesSlice.reducer
export const {
    selectAll: selectAllQuizzes,
    selectById: selectQuizById,
    selectIds: selectQuizIds,
} = quizzesAdapter.getSelectors((state: RootState) => state.quizzes)

export type { QuizAndQuestionsSchema }

export const selectQuizzesByDeckId = createSelector(
    [selectAllQuizzes, (state: RootState, deckId: number) => deckId],
    (quizzes, deckId) => quizzes.filter((quiz) => quiz.quiz.deckId === deckId)
)
