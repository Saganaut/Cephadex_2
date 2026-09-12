import Arrow from '@assets/Arrow.svg?react'
import QuizIcon from '@assets/QuizIcon.svg'
import { Filter } from '@common/Form/Filter'
import { PageHeader } from '@common/PageHeader'
import { PageWrapper } from '@common/PageWrapper'
import {
    type DeckSchema,
    type QuizAndResults,
    type QuizSchema,
    QuizService,
} from '@source/client'
import { Button } from '@source/common/Buttons/Button'
import { PreferencesSelect } from '@source/common/Form/PreferencesSelect/PreferencesSelect'
import { useIntroJS } from '@source/lib/hooks/introJS/useIntroJS'
import { useFetchQuizzes } from '@source/lib/hooks/quizzesHooks/useFetchQuizzes'
import { Steps } from 'intro.js-react'
import React, { Fragment, type ReactElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { sortOptions } from '../Group/useGroup'
import { AssignedQuizzes } from './AssignedQuizzes'
import { Step1 } from './CreateQuiz/components/Step1'
import { introSteps } from './data/introSteps'
import { QuizOptions } from './data/quizOptions'
import { MyQuizzes } from './MyQuizzes'
import { Results } from './Results'

// TODO all the fetching here should be moved to the redux store
export default function Quizzes(): ReactElement {
    const [quizSearchQuery, setQuizSearchQuery] = useState('')
    const [sortValue, setSortValue] = useState<{
        value: number
        label: string
    }>(sortOptions[0] as { value: number; label: string })
    const { justQuizzes } = useFetchQuizzes()
    const [resultIndex, setResultIndex] = useState<number | null>(null)
    const [sortedArray, setSortedArray] = useState<QuizSchema[]>()
    const [activeQuizType, setactiveQuizType] = useState(0)
    const [steps, setSteps] = useState(0)
    const navigate = useNavigate()
    const [selectedDeck, setSelectedDeck] = useState<DeckSchema | null>(null)
    // const cardsStatus = useAppSelector((state) => state.cards.status);

    const [results, setResults] = useState<QuizAndResults[] | null | undefined>(
        null
    )
    const {
        stepsRef,
        isInitialTourActive,
        handleTabChange,
        markSectionAsToured,
    } = useIntroJS({
        type: 'quiz',
        introSteps,
    })

    const getAllResults = async (): Promise<void> => {
        const myResults = await QuizService.getMyResults()
        const assignedResults = await QuizService.getAssignedResults()

        if (
            myResults.status === 'success' &&
            assignedResults.status === 'success'
        ) {
            const combinedResults = [
                ...(myResults.quizAndResults ?? []),
                ...(assignedResults.quizAndResults ?? []),
            ]

            const uniqueResults = combinedResults.filter(
                (result, index, self) =>
                    index === self.findIndex((t) => t.id === result.id)
            )

            const mergedResults = uniqueResults.reduce<
                Record<number, QuizAndResults>
            >((acc, currentQuiz) => {
                if (currentQuiz.id in acc) {
                    const existingQuiz = acc[currentQuiz.id]
                    if (existingQuiz == null) return acc
                    existingQuiz.results = [
                        ...new Set([
                            ...(existingQuiz.results ?? []),
                            ...(currentQuiz.results ?? []),
                        ]),
                    ]
                } else {
                    acc[currentQuiz.id] = currentQuiz
                }
                return acc
            }, {})

            const results = Object.values(mergedResults)
            setResults(results)
        }
    }
    //  Shared Quizzes

    // CARDS FROM REDUX

    // useEffect(() => {
    //   if (quizzes.length === 0) {
    //     void dispatch(fetchQuizzes());
    //     void dispatch(fetchSharedQuizzes());
    //   }
    // }, [dispatch]);

    useEffect(() => {
        if (selectedDeck != null) {
            navigate(`/quizzes/create/${selectedDeck.id}`)
        }
    }, [selectedDeck, navigate])

    useEffect(() => {
        if (activeQuizType === 2) {
            if (results == null) {
                void getAllResults()
            }
        }
    }, [activeQuizType, results])

    const Details = (): ReactElement => {
        return (
            <div className="pt-[14px]">
                {/* <h1 className="pb-[24px] pt-[14px] text-lg font-medium text-aquamarine">
          Take a quiz today
        </h1> */}
                <div>
                    {steps === 0 ? (
                        <Button
                            onClick={() => {
                                setSteps(1)
                            }}
                            label="Create quiz"
                        />
                    ) : (
                        'Select a deck to create a quiz from'
                    )}
                </div>
            </div>
        )
    }

    return (
        <PageWrapper>
            {/* Page Headers */}{' '}
            {activeQuizType === 0 && (
                <div className="fixed bottom-0 left-0 z-50 h-24 w-full rounded-t-xl border-t-2 border-t-white/40 bg-electric-violet-500 dark:bg-mariana-blue sm:hidden">
                    <div className="mx-10 mb-8 mt-6">
                        <Filter
                            searchPlaceHolder={'Search For Quizzes'}
                            dataArray={justQuizzes}
                            sortOptions={sortOptions}
                            sortValue={sortValue}
                            setSortValue={setSortValue}
                            setSortedArray={setSortedArray}
                            setFilterValue={setQuizSearchQuery}
                            style={'shallows'}
                        />
                    </div>
                </div>
            )}
            <div>
                <PageHeader
                    title={'Are you ready for a marine adventure?'}
                    subtitle={''}
                    CustomDetails={Details}
                    description={''}
                    img={QuizIcon}
                    type="withImage"
                />
            </div>
            {steps === 1 && (
                <Fragment>
                    <div
                        className={
                            'mb-[32px] flex items-center justify-between'
                        }
                    >
                        <div className="flex items-center gap-x-[24px]">
                            <div className="flex items-center gap-x-[24px]">
                                <Arrow
                                    onClick={() => {
                                        setSteps(0)
                                    }}
                                    className="size-[24px] cursor-pointer"
                                />
                                <h1 className="text-2xl font-bold text-white">
                                    Decks
                                </h1>
                            </div>
                            {/* <button className="rounded-full bg-mariana-blue-100 px-[16px] py-[4px] font-medium text-white">
                Add
              </button>
              <button className="rounded-full bg-mariana-blue-100 px-[16px] py-[4px] font-medium text-white">
                Import
              </button> */}
                        </div>
                    </div>
                    <Step1
                        setSelectedDeck={setSelectedDeck}
                        handleTabChange={handleTabChange}
                    />
                </Fragment>
            )}
            {steps === 0 && (
                <>
                    <div
                        id="quizzes-types"
                        className={
                            'mb-[32px] flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-between'
                        }
                    >
                        <PreferencesSelect
                            label={''}
                            options={QuizOptions}
                            activeIndex={activeQuizType}
                            setActiveIndex={setactiveQuizType}
                        />
                        <div
                            className={
                                'hidden w-full justify-end sm:block md:w-4/5 lg:w-2/5'
                            }
                        >
                            <div className="flex flex-row justify-end">
                                {activeQuizType === 0 && (
                                    <Filter
                                        searchPlaceHolder={'Search For Quizzes'}
                                        dataArray={justQuizzes}
                                        sortOptions={sortOptions}
                                        sortValue={sortValue}
                                        setSortValue={setSortValue}
                                        setSortedArray={setSortedArray}
                                        setFilterValue={setQuizSearchQuery}
                                        style={'shallows'}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {activeQuizType === 0 && (
                        <MyQuizzes
                            sortedArray={sortedArray}
                            quizSearchQuery={quizSearchQuery}
                        />
                    )}
                    {activeQuizType === 1 && (
                        <AssignedQuizzes quizSearchQuery={quizSearchQuery} />
                    )}
                    {activeQuizType === 2 && (
                        <Results
                            results={results}
                            resultIndex={resultIndex}
                            setResultIndex={setResultIndex}
                        />
                    )}
                </>
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
