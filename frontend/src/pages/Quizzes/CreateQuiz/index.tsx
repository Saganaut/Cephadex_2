import { PageWrapper } from '@common/PageWrapper'
import type {
    QuestionSchema,
    QuizDataResponse,
    QuizSchema,
} from '@source/client'
import { NotFoundComponent } from '@source/common/InfoComponents/NotFoundComponent/NotFoundComponent'
import { useIntroJS } from '@source/lib/hooks/introJS/useIntroJS'
import { Step2 } from '@source/pages/Quizzes/CreateQuiz/components/Step2'
import { Step3 } from '@source/pages/Quizzes/CreateQuiz/components/Step3'
import { Steps } from 'intro.js-react'
import React, { type ReactElement } from 'react'

import { useCreateEditQuiz } from '../hooks/useCreateEditQuiz'
import { introSteps } from './data/introSteps'

type NonEmptyArray<T> = [T, ...T[]]

export interface NonEmptyQuizDataResponse {
    status: string
    message: string
    quizzes: NonEmptyArray<QuizSchema>
    questions: NonEmptyArray<QuestionSchema>
    userType?: string | null
    userId?: number | null
    quizShareId?: string | null
}

const CreateQuiz = (): ReactElement => {
    const { stepsRef, isInitialTourActive, markSectionAsToured } = useIntroJS({
        type: 'cards',
        introSteps,
    })
    const createQuizProps = useCreateEditQuiz()

    return (
        <PageWrapper className={'text-black dark:text-white'}>
            {createQuizProps.response == null ? (
                <div className={'pb-[20px] text-white'}>
                    <Step2 createQuizProps={createQuizProps} />
                </div>
            ) : isNonEmptyQuizDataResponse(createQuizProps.response) ? (
                <Step3 response={createQuizProps.response} />
            ) : (
                <NotFoundComponent title="We encountered an error, please try again or contact us for support" />
            )}
            <Steps
                ref={stepsRef}
                enabled={isInitialTourActive}
                steps={introSteps}
                initialStep={0}
                options={{
                    overlayOpacity: 0.8,
                    showProgress: true,
                    hidePrev: true,
                    hideNext: false,
                    isActive: isInitialTourActive,
                    showStepNumbers: false,
                    showBullets: false,
                    keyboardNavigation: false,
                    dontShowAgain: false,
                    dontShowAgainLabel: "Don't show again",
                    helperElementPadding: 10,
                    disableInteraction: false,
                    scrollToElement: false,
                }}
                onExit={() => {
                    markSectionAsToured()
                }}
            />
        </PageWrapper>
    )
}

function isNonEmptyQuizDataResponse(
    response: QuizDataResponse
): response is NonEmptyQuizDataResponse {
    return response.quizzes.length > 0 && response.questions.length > 0
}

export default CreateQuiz
