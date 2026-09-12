import {
    type QuizSchema,
    type QuizSharingFullSchema,
    UserService,
} from '@source/client'
import { Button } from '@source/common/Buttons/Button'
import { NotFoundComponent } from '@source/common/InfoComponents/NotFoundComponent/NotFoundComponent'
import { PageWrapper } from '@source/common/PageWrapper'
import { useModal } from '@source/lib/contexts/ModalContext'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { getResultsForQuiz } from '@source/lib/store/quizResults/actions'
import { getOneSharedQuiz } from '@source/lib/store/quizzes/actions'
import { getUserStatus } from '@source/lib/store/user/actions'
import React, { type ReactElement, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useFetchQuizAndQuestions } from '../useFetchQuizAndQuestions'
import { HubBody } from './components/HubBody'

export default function Hub(): ReactElement {
    const { quizId } = useParams()
    const navigate = useNavigate()
    const [query] = useSearchParams()
    const quizShareId = query.get('shareId')
    const [showResults, setshowResults] = useState(false)
    const user = useAppSelector((state) => state.user.user)
    const [isCreator, setIsCreator] = useState(false)
    const [quizDetails, setQuizDetails] = useState<QuizSchema | null>(null)
    //TODO: Remove the else '' from useFetchQuizAndQuestions
    const { quizAndQuestions } = useFetchQuizAndQuestions(quizId ?? '')
    const { openSignInModal } = useModal()
    const dispatch = useAppDispatch()
    const [loginNeeded, setLoginNeeded] = useState(false)
    const [noPermission, setNoPermission] = useState(false)
    const [resultsTab, setResultsTab] = useState(0)
    const [sharedQuiz, setSharedQuiz] = useState<QuizSharingFullSchema | null>(
        null
    )

    const getQuizDetails = async (): Promise<void> => {
        if (quizAndQuestions != null) {
            setQuizDetails(quizAndQuestions.quiz)
            if (quizAndQuestions.quiz.creator === user?.id) {
                setIsCreator(true)
            }
        }
    }
    // Gets the Details & Results for an assigned Quiz
    const getSharedQuiz = async (): Promise<void> => {
        const action = await dispatch(getOneSharedQuiz(quizShareId ?? ''))
        if (getOneSharedQuiz.fulfilled.match(action)) {
            const payload = action.payload
            setSharedQuiz(payload.data)
        }
    }
    useEffect(() => {
        if (quizAndQuestions == null) return
        setQuizDetails(quizAndQuestions?.quiz)
    }, [quizAndQuestions])

    useEffect(() => {
        void (async () => {
            if (sharedQuiz != null) {
                setQuizDetails(sharedQuiz.quiz)
                if (sharedQuiz.quiz.creator === user?.id) {
                    setIsCreator(true)
                }
                if (sharedQuiz.share.type !== 'general' && user == null) {
                    setLoginNeeded(true)
                }
                if (
                    sharedQuiz.share.type === 'user' &&
                    user?.id !== sharedQuiz.share.userId
                ) {
                    setNoPermission(true)
                }
                if (sharedQuiz.share.type === 'general' && user == null) {
                    // Ensure createGuestAccount finishes before calling checkUserStatus
                    void (await UserService.createGuestAccount())
                    void (await dispatch(getUserStatus()))
                }
            }
        })()
    }, [sharedQuiz, user, dispatch])

    useEffect(() => {
        if (quizId != null && quizShareId == null) {
            void getQuizDetails()
            void getQuizResults()
        }
        if (quizShareId != null) {
            void getSharedQuiz()
        }
    }, [quizId, quizShareId])

    // Gets the results for the creator and the students
    const getQuizResults = async (): Promise<void> => {
        void dispatch(getResultsForQuiz(parseInt(quizId ?? '')))
    }

    if (sharedQuiz == null && quizAndQuestions == null) {
        return (
            <NotFoundComponent
                title="Not found"
                message="We couldn't find this quiz"
            />
        )
    }

    return (
        <PageWrapper className="text-white">
            {loginNeeded ? (
                <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/50">
                    <div className="rounded-[10px] bg-electric-violet-200 p-[40px] dark:bg-mariana-blue">
                        <h1 className="pb-[16px] text-[28px] font-bold">
                            This quiz is only accessible to registered users
                        </h1>
                        <Button
                            label="Login"
                            onClick={() => {
                                openSignInModal('login')
                            }}
                        />
                    </div>
                </div>
            ) : noPermission ? (
                <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/50">
                    <div className="rounded-[10px] bg-electric-violet-200 p-[40px] dark:bg-mariana-blue">
                        <h1 className="pb-[16px] text-[28px] font-bold">
                            This quiz is restricted to a specific user
                        </h1>
                        <Button
                            label="Go back"
                            onClick={() => {
                                navigate('/')
                            }}
                        />
                    </div>
                </div>
            ) : (
                <HubBody
                    quizDetails={quizDetails}
                    sharedQuiz={sharedQuiz}
                    isCreator={isCreator}
                    quizId={quizId}
                    setshowResults={setshowResults}
                    showResults={showResults}
                    setResultsTab={setResultsTab}
                    resultsTab={resultsTab}
                />
            )}
        </PageWrapper>
    )
}
