import type { CardSchema, QuestionSchema } from '@client/index'
import {
    createEntityAdapter,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit'
import { turnCardTypeToTempQuestionType } from '@source/lib/utils/functions'
import type { RootState } from '@store/store'

import { updateOneQuiz } from '../quizzes/actions'
import { logoutUser } from '../user/actions'
import {
    addManyTempQuestions,
    addOneTempQuestion,
    clearAllTempQuestions,
    fetchCardsAndTurnToTempQuestions,
    toggleAllTempQuestionsSelected,
    toggleSelected,
    updateManyTempQuestions,
    updateOneTempQuestion,
} from './actions'

export interface TempQuestionSchema extends QuestionSchema {
    selected: boolean
    jeopardy: boolean
}

const tempQuestionsAdapter = createEntityAdapter<TempQuestionSchema>({
    sortComparer: (a, b) => (a.qOrder ?? 1) - (b.qOrder ?? 2),
})

const initialState = tempQuestionsAdapter.getInitialState({
    status: 'idle',
    error: '',
})
//NOTE: the ids here correspond to the card ids, we should never use the card ID to modify a question

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        upsertOneQuestion: tempQuestionsAdapter.upsertOne,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        updateOneQuestion: tempQuestionsAdapter.updateOne,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        upsertManyQuestions: tempQuestionsAdapter.upsertMany,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        setQuestions: tempQuestionsAdapter.setAll,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        updateManyQuestions: tempQuestionsAdapter.updateMany,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        addOneTempQuestion: tempQuestionsAdapter.addOne,
        reorderQuestions(
            state,
            action: PayloadAction<{
                sourceIndex: number
                destinationIndex: number
            }>
        ) {
            const questions = state.ids.map(
                (id) => state.entities[id]
            ) as TempQuestionSchema[]
            const [removed] = questions.splice(action.payload.sourceIndex, 1)
            if (removed != null)
                questions.splice(action.payload.destinationIndex, 0, removed)

            questions.forEach((q, index) => {
                q.qOrder = index
            })

            tempQuestionsAdapter.setAll(state, questions)
        },
    },

    extraReducers: (builder) => {
        builder.addCase(updateOneQuiz.fulfilled, (state, action) => {
            tempQuestionsAdapter.removeAll(state)
            if (action.payload.quizzes[0]?.questions == null) return
            tempQuestionsAdapter.upsertMany(
                state,
                action.payload.quizzes[0].questions
            )
            state.status = 'succeeded'
        })
        builder.addCase(logoutUser.fulfilled, (state) => {
            tempQuestionsAdapter.removeAll(state)
        })
        builder.addCase(addManyTempQuestions, (state, action) => {
            tempQuestionsAdapter.upsertMany(state, action.payload.questions)
            state.status = 'succeeded'
        })
        builder.addCase(updateOneTempQuestion, (state, action) => {
            if (action.payload.question != null) {
                tempQuestionsAdapter.upsertOne(state, action.payload)
            }
        })
        builder.addCase(updateManyTempQuestions, (state, action) => {
            tempQuestionsAdapter.upsertMany(state, action.payload)
        })
        builder.addCase(addOneTempQuestion, (state, action) => {
            tempQuestionsAdapter.upsertOne(state, action.payload)
        })
        builder
            .addCase(clearAllTempQuestions, (state) => {
                tempQuestionsAdapter.removeAll(state)
            })
            .addCase(toggleSelected, (state, action) => {
                const question = state.entities[action.payload]
                if (question != null) {
                    tempQuestionsAdapter.updateOne(state, {
                        id: question.id,
                        changes: { selected: !question.selected },
                    })
                }
            })
            .addCase(
                fetchCardsAndTurnToTempQuestions.fulfilled,
                (state, action) => {
                    const cards = action.payload?.cards
                    const questions = cards?.map((card: CardSchema) =>
                        turnCardTypeToTempQuestionType(card)
                    )

                    if (questions == null) return
                    tempQuestionsAdapter.upsertMany(state, questions)
                }
            )
            .addCase(toggleAllTempQuestionsSelected, (state, action) => {
                const tempsQuestions = tempQuestionsAdapter
                    .getSelectors()
                    .selectAll(state)
                tempsQuestions.forEach((question) => {
                    tempQuestionsAdapter.updateOne(state, {
                        id: question.id,
                        changes: { selected: action.payload },
                    })
                })
            })
    },
})

export default questionsSlice.reducer
export const {
    selectAll: selectAllTempQuestions,
    selectById: selectTempQuestionById,
    selectIds: selectTempQuestionsIds,
} = tempQuestionsAdapter.getSelectors((state: RootState) => state.tempQuestions)
export const { reorderQuestions } = questionsSlice.actions
