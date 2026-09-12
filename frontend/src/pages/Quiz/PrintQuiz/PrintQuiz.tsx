import { pdf, PDFViewer } from '@react-pdf/renderer'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { SwitchField } from '@source/common/Form/SwitchField'
import { Loading } from '@source/common/InfoComponents/Loading'
import { PageWrapper } from '@source/common/PageWrapper'
import { useFetchUser } from '@source/lib/hooks/userHooks/useFetchUser'
import React from 'react'
import { useParams } from 'react-router-dom'

import { useFetchQuizAndQuestions } from '../useFetchQuizAndQuestions'
import { PrintableArea } from './PrintableArea'

const PrintQuiz: React.FC = () => {
    // const PAID_SUB_PLAN = 2;
    const { quizId } = useParams()
    const [includeInstructions, setIncludeInstructions] = React.useState(true)
    const [answerKey, setAnswerKey] = React.useState(false)
    const [includePoints, setIncludePoints] = React.useState(true)
    const [includeName, setIncludeName] = React.useState(true)
    const [includeDate, setIncludeDate] = React.useState(true)
    const quizAndQuestions = useFetchQuizAndQuestions(quizId ?? '')
    const quiz = quizAndQuestions.quizAndQuestions?.quiz
    const questions = quizAndQuestions.quizAndQuestions?.questions
    const [qtyLines, setQtyLines] = React.useState(4)
    const user = useFetchUser()
    
    // const freeUser =
    //   user?.user.subscriptionPlan !== undefined &&
    //   !(user.user.subscriptionPlan > PAID_SUB_PLAN);
    const [isMobile, setIsMobile] = React.useState(false)
    React.useEffect(() => {
        // Check for mobile on mount
        const checkMobile = (): void => {
            const mobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                )
            // Optional: also check screen width
            const smallScreen = window.innerWidth < 768 // or whatever breakpoint you prefer
            setIsMobile(mobile || smallScreen)
        }

        checkMobile()
        // Optional: update on resize
        window.addEventListener('resize', checkMobile)
        return () => {
            window.removeEventListener('resize', checkMobile)
        }
    }, [])
    if (quizId == null) return <Loading />
    const handleDownload = async (): Promise<void> => {
        const blob = await pdf(
            <PrintableArea
                quiz={quiz}
                includeInstructions={includeInstructions}
                includePoints={includePoints}
                includeName={includeName}
                includeDate={includeDate}
                answerKey={answerKey}
                user={user.user}
                questions={questions}
                qtyLines={qtyLines}
                freeUser={(user.user.subscriptionPlan ?? 1) > 1}
            />
        ).toBlob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'quiz.pdf'
        a.click()
        window.URL.revokeObjectURL(url)
    }
    return (
        <PageWrapper>
            <div className="relative z-[5]">
                <div className="rounded-t-[10px] bg-electric-violet-200 px-[20px] py-[10px] text-tolopea dark:bg-mariana-blue dark:text-white sm:flex sm:justify-between sm:px-[40px] sm:py-[20px]">
                    <div>{quizAndQuestions.quizAndQuestions?.quiz?.name}</div>
                    <div className="flex items-center gap-2 rounded-xl bg-electric-violet-700 p-2">
                        <p className="text-white">Quiz</p>
                        <SwitchField
                            enabled={answerKey}
                            setEnabled={() => {
                                setAnswerKey(!answerKey)
                            }}
                        />
                        <p className="text-white">Answer key</p>
                    </div>
                </div>
                <div className="mt-[4px] flex-col  items-center justify-start gap-6 rounded-b-[10px] bg-electric-violet-200 px-[20px] py-[9px] text-tolopea dark:bg-mariana-blue dark:text-white sm:gap-2 sm:px-[40px] sm:py-[18px]">
                    <h4 className="pb-4"> What should we include?</h4>
                    <div className="flex gap-2">
                        <div className="flex  items-center gap-1">
                            <p>Instructions</p>
                            <SwitchField
                                enabled={includeInstructions}
                                setEnabled={() => {
                                    setIncludeInstructions(!includeInstructions)
                                }}
                            />
                        </div>
                        {!answerKey && (
                            <>
                                <div className="flex items-center gap-1">
                                    <p>Points</p>
                                    <SwitchField
                                        enabled={includePoints}
                                        setEnabled={() => {
                                            setIncludePoints(!includePoints)
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <p>Name space</p>
                                    <SwitchField
                                        enabled={includeName}
                                        setEnabled={() => {
                                            setIncludeName(!includeName)
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <p>Date</p>
                                    <SwitchField
                                        enabled={includeDate}
                                        setEnabled={() => {
                                            setIncludeDate(!includeDate)
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <p>Lines</p>
                                    <div className="flex w-10 items-center  rounded-lg border border-white ">
                                        <input
                                            className="w-[40px]  bg-transparent  pl-[20px] font-medium text-tolopea outline-none focus:outline-none dark:text-white"
                                            type="number"
                                            value={qtyLines}
                                            name=""
                                            onBlur={() => {}}
                                            onChange={(e) => {
                                                setQtyLines(
                                                    parseInt(
                                                        e.currentTarget.value
                                                    )
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {isMobile ? (
                    <div className="flex items-center justify-center gap-4 p-2 pt-10">
                        <p>Preview unavailable on mobile devices</p>
                        <StyledButton
                            label={'Download'}
                            onClick={handleDownload}
                        />
                    </div>
                ) : (
                    <div className="pt-4">
                        {quiz != null && questions != null ? (
                            <PDFViewer className="h-screen min-h-[500px] w-full pb-20">
                                <PrintableArea
                                    quiz={quiz}
                                    includeInstructions={includeInstructions}
                                    includePoints={includePoints}
                                    includeName={includeName}
                                    includeDate={includeDate}
                                    answerKey={answerKey}
                                    user={user.user}
                                    questions={questions}
                                    qtyLines={qtyLines}
                                    freeUser={
                                        (user.user.subscriptionPlan ?? 1) > 1
                                    }
                                />
                            </PDFViewer>
                        ) : (
                            <p>Quiz not found</p>
                        )}
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}

export default PrintQuiz
