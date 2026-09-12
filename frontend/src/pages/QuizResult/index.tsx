import { PageWrapper } from '@common/PageWrapper'
import { Header } from '@quiz/components/Results/Header'
import {
    ApiError,
    QuizService,
    type SingleQuizResultResponse,
} from '@source/client'
import { ErrorMessage } from '@source/common/InfoComponents/ErrorMessage'
import { Loading } from '@source/common/InfoComponents/Loading'
import React, {
    type ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { SingleAnswer } from '../Quiz/components/Results/SingleAnswer'

export default function QuizResult(): ReactElement {
    const { resultId } = useParams()
    const [query] = useSearchParams()
    const guestId = query.get('guestId')
    const [collapse, setCollapse] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [errorTitle, setErrorTitle] = useState('')
    const [quizResults, setQuizResults] =
        useState<SingleQuizResultResponse | null>(null)

    const fetchQuizResults = useCallback(async (): Promise<void> => {
        try {
            // This code might throw an error.
            const results = await QuizService.getQuizResult(
                parseInt(resultId ?? ''),
                guestId != null ? parseInt(guestId) : null
            )
            setQuizResults(results)
        } catch (e) {
            if (e instanceof ApiError) {
                setErrorMessage((e.body.detail as string) ?? 'Unknown error')
                setErrorTitle(e.status + ' - ' + e.statusText)
            }
        }
    }, [resultId, guestId])

    useEffect(() => {
        if (resultId == null) return
        void fetchQuizResults()
    }, [resultId, fetchQuizResults])

    if (errorMessage !== '') {
        return <ErrorMessage title={errorTitle} message={errorMessage} />
    }

    return (
        <PageWrapper>
            {quizResults !== null ? (
                <div>
                    <Header
                        quizResults={quizResults}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        correct={quizResults.quizResult?.correct ?? 0}
                        points={quizResults.quizResult?.points ?? 0}
                    />
                    {quizResults.gradedResults?.map((q, i) => (
                        <SingleAnswer
                            collapse={collapse}
                            key={i}
                            points={q.result?.points ?? 0}
                            term={q.question.term ?? 'Term'}
                            correct={q.correct}
                            correctAnswer={
                                q.question.content ?? 'Correct answer'
                            }
                            yourAnswer={q.result?.answer}
                        />
                    ))}
                </div>
            ) : (
                <Loading />
            )}
        </PageWrapper>
    )
}
