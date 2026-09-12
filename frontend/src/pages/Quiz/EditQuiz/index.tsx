import { PageHeader } from '@common/PageHeader'
import { EditBody } from '@quiz/EditQuiz/EditBody'
import type { QuizData } from '@quizzes/components/Heading'
import type { QuestionSchema, QuizSchema } from '@source/client'
import { Loading } from '@source/common/InfoComponents/Loading'
import { PageWrapper } from '@source/common/PageWrapper'
import {
    addManyTempQuestions,
    clearAllTempQuestions,
} from '@source/lib/store/tempQuestions/actions'
import type { TempQuestionSchema } from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import { useCreateEditQuiz } from '@source/pages/Quizzes/hooks/useCreateEditQuiz'
import type { NonEmptyArray } from '@source/types'
import { useAppDispatch } from '@store/hooks'
import React, { type ReactElement, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFetchQuizAndQuestions } from '../useFetchQuizAndQuestions'

export default function EditQuiz(): ReactElement {
    const { quizId } = useParams()
    const [quiz, setQuiz] = useState<QuizSchema | null>(null)
    const [loading, setLoading] = useState(true)
    const [quizData, setQuizData] = useState<QuizData | null>(null) // For the Modal
    const { quizAndQuestions } = useFetchQuizAndQuestions(quizId ?? '')
    const { questions, orderedQuestions, setOrderedQuestions } =
        useCreateEditQuiz()

    const [questionsCleared, setQuestionsCleared] = React.useState(false)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!questionsCleared) {
            setQuestionsCleared(true)
            void dispatch(clearAllTempQuestions())
        }
    }, [dispatch, questionsCleared])
    const turnQuestionIntoTempQuestion = (
        question: QuestionSchema
    ): TempQuestionSchema => {
        const convertedQuestion = {
            ...question,
            selected: true,
            jeopardy: false,
        }
        return convertedQuestion
    }

    useEffect(() => {
        if (quizAndQuestions != null) {
            const fetchOneQuizAndQuestions = async (): Promise<void> => {
                setLoading(true)
                try {
                    if (
                        quizAndQuestions?.questions != null &&
                        quizAndQuestions?.quiz != null
                    ) {
                        setQuiz(quizAndQuestions.quiz)
                        setQuizData({
                            quizDescription:
                                quizAndQuestions.quiz.description ?? '',
                            quizInstructions:
                                quizAndQuestions.quiz.instructions ?? '',
                            quizName: quizAndQuestions.quiz.name ?? '',
                            quizSubject: quizAndQuestions.quiz.subject ?? '',
                            quizTopic: quizAndQuestions.quiz.topic ?? '',
                            timeLimit: quizAndQuestions.quiz.timeLimit ?? 0,
                            dueDate: new Date(
                                quizAndQuestions.quiz.dueDate ?? ''
                            ),
                        })
                        const convertedQuestions =
                            quizAndQuestions.questions.map(
                                turnQuestionIntoTempQuestion
                            )
                        dispatch(addManyTempQuestions(convertedQuestions))
                        if (
                            quizAndQuestions?.questions != null &&
                            quizAndQuestions?.questions.length > 0
                        ) {
                            // Create a shallow copy of the array before sorting
                            const sortedQuestions = [
                                ...convertedQuestions,
                            ].sort((a, b) => {
                                // Handle cases where qOrder might be null or undefined
                                if (a.qOrder == null && b.qOrder == null) {
                                    return 0 // Both are null or undefined, consider them equal
                                } else if (a.qOrder == null) {
                                    return 1 // Place `a` after `b` if `a.qOrder` is null or undefined
                                } else if (b.qOrder == null) {
                                    return -1 // Place `b` after `a` if `b.qOrder` is null or undefined
                                } else {
                                    return a.qOrder - b.qOrder // Both are numbers, perform normal comparison
                                }
                            })

                            setOrderedQuestions(sortedQuestions) // Use the sorted copy
                        }
                    } else {
                        throw new Error('No data found')
                    }
                } catch (e) {
                } finally {
                    setLoading(false)
                }
            }

            void fetchOneQuizAndQuestions()
        }
    }, [quizAndQuestions, dispatch, setOrderedQuestions])

    // Save the unselected questions to be deleted
    // Initial Questions : questions (state)
    // Final Questions : FinalQuestions (redux state)

    useEffect(() => {
        if (questions.length === 0) {
            dispatch(addManyTempQuestions(orderedQuestions))
        }
    }, [orderedQuestions, dispatch, questions])

    const Details = (): ReactElement => {
        return (
            <div className="pt-[14px]">
                {quiz?.description != null && (
                    <h1 className="pb-[24px] pt-[14px] text-lg font-medium text-aquamarine">
                        {quiz?.description}
                    </h1>
                )}
                <div className="flex gap-2">
                    {quiz?.subject != null && quiz.subject.length > 0 && (
                        <div
                            className={
                                'w-fit whitespace-nowrap rounded-[30px] bg-mariana-blue-100  px-[18px] py-[4px] text-center text-[14px] font-medium text-white'
                            }
                        >
                            {quiz?.subject}
                        </div>
                    )}
                    <div
                        className={
                            'w-fit whitespace-nowrap rounded-[30px] bg-mariana-blue-100 px-[18px]  py-[4px] text-center text-[14px] font-medium text-white'
                        }
                    >
                        {quiz?.qtyQuestions} questions
                    </div>
                    <div
                        className={
                            'w-fit whitespace-nowrap rounded-[30px] bg-mariana-blue-100 px-[18px] py-[4px] text-center text-[14px] font-medium text-white'
                        }
                    >
                        {quiz?.points} points
                    </div>
                </div>
            </div>
        )
    }
    return (
        <PageWrapper className={'text-white'}>
            {loading || quiz == null || questions == null ? (
                <Loading />
            ) : (
                <div>
                    {/* Quiz Details */}
                    <PageHeader
                        subtitle={
                            quiz?.topic != null && quiz?.topic?.length > 0
                                ? quiz.topic
                                : ''
                        }
                        title={quiz.name}
                        description={
                            quiz?.description != null &&
                            quiz?.description?.length > 0
                                ? quiz.description
                                : ''
                        }
                        img={quiz.img}
                        type="withImage"
                        CustomDetails={Details}
                    />
                    <EditBody
                        Quiz={quiz}
                        orderedCards={
                            questions as NonEmptyArray<TempQuestionSchema>
                        } // this is okay as checking it is non empty above
                        // collapseMode={collapseMode}
                        // setCollapseMode={setCollapseMode}
                        // jeopardy={jeopardy}
                        QuizDetails={quizData}
                        // toggleJeopardy={toggleJeopardy}
                    />
                </div>
            )}
            {/* <div className={"h-[80vh] w-full"}> */}
            {/*   <PDFViewer className={"h-full w-full"}> */}
            {/*     <Doc questions={questions} quiz={quiz} /> */}
            {/*   </PDFViewer> */}
            {/* </div> */}
        </PageWrapper>
    )
}
