import 'swiper/css'

import { PageWrapper } from '@common/PageWrapper'
import { Details } from '@quiz/components/Details'
import { Navigation } from '@quiz/components/Navigation'
import { Question } from '@quiz/components/Question'
import { QuizCard } from '@quiz/components/QuizCard'
import {
    type QuestionSchema,
    type QuizSchema,
    QuizService,
} from '@source/client'
import type { CardType } from '@source/common/Form/CardTypeSelector/cardTypes'
import { Loading } from '@source/common/InfoComponents/Loading'
import { DeleteConfirmationModal } from '@source/common/Modals/DeleteConfirmationModal'
import {
    addAnswerToQuiz,
    clearAnswers,
} from '@source/lib/store/quizzes/quizzesSlice'
import { Timer } from '@source/pages/Game/components/Playground/CTA/Timer'
import type { ITimerState } from '@source/types'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { getUserStatus } from '@store/user/actions'
import React, { type ReactElement, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'

interface QuizAndQuestions {
    quiz: QuizSchema
    questions: QuestionSchema[]
}
//TODO: Clean up and refactor this component
export default function Quiz(): ReactElement {
    const { quizId } = useParams()
    const [query] = useSearchParams()
    const shareId = query.get('shareId')
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user.user)
    const userStatus = useAppSelector((state) => state.user.status)
    const swiperRef = useRef<SwiperType | null>(null)
    const [quizAndQuestions, setquizAndQuestions] =
        useState<QuizAndQuestions | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const answers = useAppSelector((state) => state.quizzes.answers)
    const [resultId, setResultId] = useState<number | null>(null)
    const [proxyDefAnswer, setProxyDefAnswer] = useState('')
    const [startTime, setStartTime] = useState<string | null>(null)
    const [isOpen, setIsOpen] = React.useState(false)
    const [timerState, setTimerState] = useState<ITimerState>({
        state: 'going',
        context: 'quiz',
    })
    useEffect(() => {
        const start = new Date().toISOString()
        setStartTime(start)
    }, [])

    // const { quizAndQuestions } = useFetchQuizAndQuestions(quizId ?? "");
    // TODO why arew we dispatching user status here?
    useEffect(() => {
        if (userStatus === 'idle') {
            void dispatch(getUserStatus())
        }
    }, [dispatch, userStatus])

    // Logic to get the quiz data

    const [seconds, setSeconds] = useState(
        quizAndQuestions?.quiz?.timeLimit ?? 0 * 60
    )

    useEffect(() => {
        if (seconds === 0 && timerState.state === 'going') {
            if (timerState.context === 'quiz') {
                // setTimerState({ state: 'ended', context: 'quiz' })
                setSeconds(quizAndQuestions?.quiz?.timeLimit ?? 0)
            }
        }
    }, [
        seconds,
        quizAndQuestions?.quiz?.timeLimit,
        timerState.context,
        timerState.state,
    ])

    useEffect(() => {
        const getquizAndQuestions = async (): Promise<void> => {
            if (quizId == null) return
            if (shareId != null) {
                const response =
                    await QuizService.getSharedQuizAndQuestions(shareId)
                const formattedResponse = {
                    quiz: response.quizzes[0],
                    questions: response.questions,
                }
                if (formattedResponse.quiz != null)
                    setquizAndQuestions({
                        quiz: formattedResponse.quiz,
                        questions: formattedResponse.questions,
                    })
                else {
                    // Impelment error handling here
                }
            } else {
                const response = await QuizService.getQuizAndQuestions(
                    parseInt(quizId)
                )
                if (
                    response.quizzes.length === 0 ||
                    response.questions.length === 0
                ) {
                    return
                }
                const formattedResponse = {
                    quiz: response.quizzes[0],
                    questions: response.questions,
                }
                if (formattedResponse.quiz != null)
                    setquizAndQuestions({
                        quiz: formattedResponse.quiz,
                        questions: formattedResponse.questions,
                    })
                else {
                    // Impelment error handling here
                }
            }
        }

        void getquizAndQuestions()
    }, [quizId, shareId])

    const setSwiperRef = (ref: SwiperType): void => {
        swiperRef.current = ref
    }
    useEffect(() => {
        if (timerState.state === 'idle') return

        const intervalId = setInterval(() => {
            if (seconds > 0) {
                setSeconds((prevSeconds) => prevSeconds - 1)
            } else {
                clearInterval(intervalId)
            }
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [timerState, seconds])
    const initialSeconds = (quizAndQuestions?.quiz?.timeLimit ?? 0) * 60

    useEffect(() => {
        setSeconds(initialSeconds)
    }, [setSeconds, initialSeconds])
    const handleDefAnswer = (): void => {
        if (proxyDefAnswer !== '') {
            dispatch(
                addAnswerToQuiz({
                    answer: proxyDefAnswer,
                    testId: parseInt(quizId ?? ''),
                    questionId:
                        quizAndQuestions?.questions?.[activeIndex]?.id ?? 0,
                    taker: user?.id ?? 0,
                })
            )
        }
        setProxyDefAnswer('')
    }
    const navigate = useNavigate()

    const handleSubmitQuiz = async (): Promise<void> => {
        if (quizAndQuestions == null || quizId == null) return
        const questionAnswers = [...answers]

        if (proxyDefAnswer !== '') {
            questionAnswers.push(
                dispatch(
                    addAnswerToQuiz({
                        answer: proxyDefAnswer,
                        testId: parseInt(quizId),
                        questionId:
                            quizAndQuestions?.questions?.[activeIndex]?.id ?? 0,
                        taker: user?.id ?? 0,
                    })
                ).payload
            )
        }

        quizAndQuestions.questions.forEach((question) => {
            const questionAnswered = questionAnswers.some(
                (answer) => answer.questionId === question.id
            )
            if (!questionAnswered) {
                questionAnswers.push({
                    answer: '',
                    testId: parseInt(quizId),
                    questionId: question.id,
                    taker: user?.id ?? 0,
                })
            }
        })
        const response =
            shareId != null
                ? await QuizService.takeSharedQuiz(shareId, {
                      quizId: parseInt(quizId),
                      questionAnswers,
                      startTime,
                      endTime: new Date().toISOString(),
                  })
                : await QuizService.takeQuiz(parseInt(quizId), {
                      quizId: parseInt(quizId),
                      questionAnswers,
                      startTime,
                      endTime: new Date().toISOString(),
                  })
        setResultId(response.quizResultId)

        dispatch(clearAnswers())
        setProxyDefAnswer('')
    }

    useEffect(() => {
        if (timerState.state === 'ended') {
            void handleSubmitQuiz()
        }
    }, [timerState]) // eslint-disable-line react-hooks/exhaustive-deps

    // Send user to results page
    // TODO FIgure out why we are doing this instead of just sending the user directly to the page?  Why does this need to be in a useEffect?
    useEffect(() => {
        if (resultId == null) return
        navigate(`/quiz/${quizId}/result/${resultId}`)
    }, [resultId]) // eslint-disable-line react-hooks/exhaustive-deps

    if (quizAndQuestions?.questions == null) return <Loading />

    return (
        <PageWrapper>
            <div
                className="mx-auto  w-[90%] max-w-[1200px] "
                data-testid="take-quiz-info"
            >
                <Details
                    questionPoints={
                        quizAndQuestions?.questions?.[activeIndex]?.points
                    }
                    questionsNumber={quizAndQuestions?.questions?.length}
                    activeIndex={activeIndex}
                />
                {timerState.state !== 'ended' && (
                    <div className={'px-[20px] text-white'}>
                        {quizAndQuestions?.quiz?.timeLimit != null && (
                            <Timer
                                initialSeconds={initialSeconds}
                                setTimerState={setTimerState}
                                timerState={timerState}
                                seconds={seconds}
                            />
                        )}
                    </div>
                )}
            </div>
            <div
                className={
                    'mx-auto mt-[10px] w-[90%]  max-w-[1200px] grow rounded-[18px] border-8 border-mariana-blue-100 '
                }
            >
                <div
                    className={'flex flex-row-reverse items-end gap-x-[20px]'}
                    data-testid="take-quiz-question"
                >
                    <Question
                        question={
                            quizAndQuestions?.questions?.[activeIndex]?.question
                        }
                        expanded={
                            quizAndQuestions?.questions?.[activeIndex]?.boc4 ===
                            null
                        }
                        type={
                            quizAndQuestions?.questions?.[activeIndex]
                                ?.qType as CardType
                        }
                    />
                </div>

                {/* CARD CONTENT */}
                <div className="" data-testid="take-quiz-content">
                    <Swiper
                        modules={[Keyboard]}
                        keyboard={{
                            enabled: true,
                        }}
                        onInit={(swiper) => {
                            setSwiperRef(swiper)
                        }}
                        className={
                            'z-40 mt-[20px] flex min-h-[300px] w-full items-center justify-center'
                        }
                        // onSwiper={(swiper) => {
                        //   setSwiperRef(swiper);
                        // }}
                        spaceBetween={0}
                        slidesPerView={1}
                        // allowTouchMove={false}
                        onSlideChange={(e) => {
                            setActiveIndex(e.activeIndex)
                            handleDefAnswer()
                        }}
                    >
                        {quizAndQuestions?.questions?.map((question, index) => (
                            <SwiperSlide
                                key={question.id}
                                className={
                                    ' flex min-h-[300px] w-full items-center justify-center px-[10px] sm:px-[40px]'
                                }
                            >
                                <QuizCard
                                    quizId={quizId}
                                    question={question}
                                    key={index}
                                    setProxyDefAnswer={setProxyDefAnswer}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className="z-40 mt-[-14px] py-2">
                    <Navigation
                        handleSubmitQuiz={handleSubmitQuiz}
                        setIsOpen={setIsOpen}
                        swiperRef={swiperRef}
                        activeIndex={activeIndex}
                        quizAndQuestions={quizAndQuestions}
                    />
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleDelete={handleSubmitQuiz}
                title={'Submit Quiz'}
                message={"Are you sure you're finished?"}
                type={'submit'}
            />
        </PageWrapper>
    )
}
