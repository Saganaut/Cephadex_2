import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { getQuizAndQuestions } from '@source/lib/store/quizzes/actions'
import type { QuizAndQuestionsSchema } from '@source/lib/store/quizzes/quizzesSlice'
import { selectQuizById } from '@source/lib/store/quizzes/quizzesSlice'
import { useEffect } from 'react'

const useFetchQuizAndQuestions = (
    quizId: string
): { quizAndQuestions?: QuizAndQuestionsSchema } => {
    const dispatch = useAppDispatch()
    const quizAndQuestions = useAppSelector((state) =>
        selectQuizById(state, parseInt(quizId))
    )

    useEffect(() => {
        if (quizId == null) return
        if (quizAndQuestions?.questions == null) {
            void dispatch(getQuizAndQuestions(parseInt(quizId)))
        }
    }, [quizId, dispatch, quizAndQuestions])

    return { quizAndQuestions }
}

export { useFetchQuizAndQuestions }
