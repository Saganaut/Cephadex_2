import type {
    QuizResultSchema,
    QuizSchema,
    QuizSharingFullSchema,
} from '@source/client'
import { PreferencesSelect } from '@source/common/Form/PreferencesSelect/PreferencesSelect'
import { useAppSelector } from '@source/lib/store/hooks'
import { selectByQuizID } from '@source/lib/store/quizResults/quizResultsSlice'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { CTA } from './CTA'
import { HubResults } from './HubResults.tsx'
import { Points } from './ResultItem/Points'
import { QuestionsInfo } from './ResultItem/QuestionsInfo'
import { QuizInfo } from './ResultItem/QuizInfo'
import { TimeLimit } from './ResultItem/TimeLimit'

interface HubBodyProps {
    quizDetails: QuizSchema | null
    sharedQuiz: QuizSharingFullSchema | null
    quizResults?: QuizResultSchema[] | null
    isCreator: boolean
    quizId?: string
    setshowResults: React.Dispatch<React.SetStateAction<boolean>>
    showResults: boolean
    setResultsTab: (value: number) => void
    resultsTab: number
}
const HubBody: React.FC<HubBodyProps> = ({
    quizDetails,
    sharedQuiz,
    isCreator,
    quizId,
    setshowResults,
    showResults,
    setResultsTab,
    resultsTab,
}) => {
    const user = useAppSelector((state) => state.user.user)

    const actualQuizId = quizId ?? sharedQuiz?.quiz?.id.toString()
    const quizResults = useAppSelector((state) =>
        selectByQuizID(state, Number(actualQuizId))
    )
    const combinedResults = [...quizResults, ...(sharedQuiz?.results ?? [])]
    const quizResultsNonUndefined = combinedResults.filter(
        (result) => result !== undefined
    )

    return (
        <>
            <div className="relative z-[5]">
                <div className="rounded-t-[10px] bg-electric-violet-200 px-[20px] py-[10px] text-tolopea dark:bg-mariana-blue dark:text-white sm:flex sm:justify-between sm:px-[40px] sm:py-[20px]">
                    <QuizInfo
                        quizDetails={quizDetails}
                        sharedQuiz={sharedQuiz}
                    />
                    <div className="mt-[12px] flex items-center gap-x-[24px]">
                        <QuestionsInfo
                            numQuestions={
                                quizDetails?.qtyQuestions ??
                                sharedQuiz?.quiz?.qtyQuestions ??
                                0
                            }
                        />
                        <Points points={quizDetails?.points ?? 0} />
                        {quizDetails?.timeLimit != null &&
                            quizDetails?.timeLimit !== 0 && (
                                <TimeLimit timeLimit={quizDetails?.timeLimit} />
                            )}
                    </div>
                </div>

                <CTA
                    isCreator={isCreator}
                    quizShareId={sharedQuiz?.share?.shareId ?? null}
                    canRetake={sharedQuiz?.share?.canRetake ?? false}
                    quizId={parseInt(actualQuizId ?? '')}
                    setShowResults={setshowResults}
                    showResults={showResults}
                />
            </div>
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: -200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -200 }}
                        className="relative z-[2] mt-[24px] w-full"
                    >
                        <PreferencesSelect
                            label=""
                            className=""
                            setActiveIndex={setResultsTab}
                            activeIndex={resultsTab}
                            options={[
                                {
                                    label: 'My Results',
                                    value: 'my-res',
                                    icon: null,
                                },
                                {
                                    label: 'My students results',
                                    value: 'students-res',
                                    icon: null,
                                },
                            ]}
                        />
                        {/* Results */}
                        {quizResults.length > 0 &&
                            isString(actualQuizId) &&
                            user !== null && (
                                <HubResults
                                    quizResults={quizResultsNonUndefined}
                                    quizId={actualQuizId}
                                    resultsTab={resultsTab}
                                    user={user}
                                />
                            )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export { HubBody }

const isString = (value: unknown): value is string => typeof value === 'string'
