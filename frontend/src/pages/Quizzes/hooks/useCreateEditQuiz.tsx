import type { QuizDataResponse } from '@source/client'
import type { IPageCount } from '@source/lib/hooks/deckHooks/useFetchCards'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { setQuestions } from '@source/lib/store/questions/actions'
import { createOneNewQuiz } from '@source/lib/store/quizzes/actions'
import {
    clearAllTempQuestions,
    fetchCardsAndTurnToTempQuestions,
    toggleAllTempQuestionsSelected,
    updateOneTempQuestion,
} from '@source/lib/store/tempQuestions/actions'
import {
    selectAllTempQuestions,
    type TempQuestionSchema,
} from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import type { FetchCardsParams } from '@store/cards/actions'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import type { QuizData } from '../components/Heading'

export interface useCreateEditQuizResponse {
    deckId: string | undefined
    handleJeopardy: (card: TempQuestionSchema) => void
    jeopardy: boolean
    tempQuestions: TempQuestionSchema[]
    toggleJeopardy: () => void
    openCarousel: boolean
    setOpenCarousel: React.Dispatch<React.SetStateAction<boolean>>
    collapseMode: boolean
    setCollapseMode: React.Dispatch<React.SetStateAction<boolean>>
    response: QuizDataResponse | null
    setResponse: React.Dispatch<React.SetStateAction<QuizDataResponse | null>>
    quizDetails: QuizData | null
    setQuizDetails: React.Dispatch<React.SetStateAction<QuizData | null>>
    openQuizDetails: boolean
    setOpenQuizDetails: React.Dispatch<React.SetStateAction<boolean>>
    cardSearchQuery: string
    setCardSearchQuery: React.Dispatch<React.SetStateAction<string>>
    selectAll: boolean
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>
    showOnlySelected: boolean
    setShowOnlySelected: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    isLoading: boolean
    handleOpenCarousel: (Card: TempQuestionSchema) => void
    selectedCard: TempQuestionSchema | null
    setSelectedCard: React.Dispatch<
        React.SetStateAction<TempQuestionSchema | null>
    >
    step: number
    setStep: React.Dispatch<React.SetStateAction<number>>
    createQuiz: () => Promise<void>
    fetchParams: FetchCardsParams
    setFetchParams: React.Dispatch<React.SetStateAction<FetchCardsParams>>
    handleAddingQuestions: () => void
    handleShowingOnlySelected: () => void
    handleCollapse: () => void
}

const useCreateEditQuiz = (): useCreateEditQuizResponse => {
    const dispatch = useAppDispatch()

    const { deckId } = useParams()

    const [questionsCleared, setQuestionsCleared] = useState(false)

    const tempQuestions = useAppSelector(selectAllTempQuestions)

    const [jeopardy, setJeopardy] = useState(false)
    const [response, setResponse] = useState<QuizDataResponse | null>(null)
    const [quizDetails, setQuizDetails] = useState<QuizData | null>(null)
    const [openCarousel, setOpenCarousel] = useState(false)
    const [collapseMode, setCollapseMode] = useState(true)
    const [openQuizDetails, setOpenQuizDetails] = useState(false)
    const [cardSearchQuery, setCardSearchQuery] = useState('')
    const [selectAll, setSelectAll] = useState(true)
    const [showOnlySelected, setShowOnlySelected] = useState(false)
    const [step, setStep] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedCard, setSelectedCard] = useState<TempQuestionSchema | null>(
        tempQuestions[0] ?? null
    )
    const [fetchParams, setFetchParams] = useState<FetchCardsParams>({
        searchQuery: '',
        deckId: parseInt(deckId ?? ''),
        order: 'desc',
        page: 1,
        reset: false,
        itemsPerPage: 24,
        sortValue: 'Date',
    })
    const [pages, setPages] = useState<IPageCount>({
        currentPage: 0,
        totalPages: 1,
    })

    const memoizedFetchParams = useMemo(
        () => fetchParams,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            // need to disable here in order to properly use the memoized value in the useffect below
            fetchParams.deckId,
            fetchParams.page,
            fetchParams.searchQuery,
            fetchParams.sortValue,
            fetchParams.order,
        ]
    )

    const memoizedPages = useMemo(
        () => pages,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pages.currentPage, pages.totalPages] // need to disable here in order to properly use the memoized value in the useffect below
    )

    useEffect(() => {
        const getCards = async (): Promise<void> => {
            void (await dispatch(
                fetchCardsAndTurnToTempQuestions(memoizedFetchParams)
            ))
        }

        if (
            memoizedPages.currentPage >= memoizedPages.totalPages &&
            memoizedFetchParams.reset === false
        )
            return
        if (memoizedFetchParams.deckId !== undefined) {
            if (memoizedFetchParams.reset != null) void getCards()
        }
    }, [dispatch, memoizedPages, memoizedFetchParams])

    useEffect(() => {
        if (!questionsCleared) {
            setQuestionsCleared(true)
            void dispatch(clearAllTempQuestions())
        }
    }, [dispatch, questionsCleared])

    // useEffect(() => {
    //     if (cardsStatus === 'succeeded' && tempQuestions.length === 0) {
    //         if (cards.length > 0) {
    //             setOrderedQuestions(
    //                 cards.map((card) => {
    //                     const transformedCard = turnCardTypeToQuestionType(card)
    //                     return {
    //                         ...transformedCard,
    //                         selected: true,
    //                         jeopardy: false,
    //                     }
    //                 })
    //             )
    //         }
    //     }
    // }, [cardsStatus, deckId, cards, setOrderedQuestions, tempQuestions])

    // useEffect(() => {
    //     if (tempQuestions.length === 0 && orderedQuestions.length > 0) {
    //         dispatch(addManyTempQuestions(orderedQuestions))
    //     }
    // }, [orderedQuestions, tempQuestions, dispatch])

    // useEffect(() => {
    //     void dispatch(
    //         fetchCardsAndTurnToTempQuestions({
    //             searchQuery: '',
    //             deckId: 31,
    //             order: 'desc',
    //             page: 1,
    //             reset: false,
    //             itemsPerPage: 24,
    //             sortValue: 'Date',
    //         })
    //     )
    // }, [deckId, dispatch])

    const handleOpenCarousel = (Card: TempQuestionSchema): void => {
        setOpenCarousel(true)
        setSelectedCard(Card)
    }
    const handleJeopardy = (card: TempQuestionSchema): void => {
        if (card.qType === 'Mcq') return
        const term = card.term
        const content = card.content
        if (jeopardy && card.selected) {
            const updatedQuestion = {
                ...card,
                content: term,
                term: content,
                question: content,
                jeopardy: true,
            }
            dispatch(updateOneTempQuestion(updatedQuestion))
        } else if (!jeopardy && card.selected) {
            const updatedQuestion = {
                ...card,
                content: term,
                term: content,
                question: content,
                jeopardy: false,
            }
            dispatch(updateOneTempQuestion(updatedQuestion))
        }
    }
    const toggleJeopardy = (): void => {
        setJeopardy(!jeopardy)
        const selectedQuestions = tempQuestions.filter(
            (tempQuestions) => tempQuestions.selected
        )
        selectedQuestions.forEach((card) => {
            handleJeopardy(card)
        })
    }
    const createQuiz = useCallback(async (): Promise<void> => {
        setIsLoading(true)
        const dueDate =
            quizDetails?.dueDate?.toISOString().split('T')[0] +
            'T' +
            ('0' + quizDetails?.dueDate?.getHours()).slice(-2) +
            ':' +
            ('0' + quizDetails?.dueDate?.getMinutes()).slice(-2) +
            ':' +
            ('0' + quizDetails?.dueDate?.getSeconds()).slice(-2)

        const timeLimit =
            quizDetails?.timeLimit === 0 ? null : quizDetails?.timeLimit
        const selectedQuestions = tempQuestions
            .filter((q) => q.selected)
            .map(({ ...rest }) => ({ ...rest }))

        const questionPoints = selectedQuestions.reduce((acc, curr) => {
            return acc + (curr.points ?? 0)
        }, 0)
        const response = await dispatch(
            createOneNewQuiz({
                quiz: {
                    name: quizDetails?.quizName ?? '',
                    description: quizDetails?.quizDescription,
                    topic: quizDetails?.quizTopic,
                    instructions: quizDetails?.quizInstructions,
                    subject: quizDetails?.quizSubject,
                    numQuestions: tempQuestions.length,
                    jeopardy,
                    points: questionPoints,
                    deckId: parseInt(deckId ?? ''),
                    dueDate: dueDate === 'undefinedTed:ed:ed' ? null : dueDate,
                    timeLimit,
                },
                questions: selectedQuestions,
            })
        )

        if (response !== null) {
            dispatch(setQuestions([]))

            if (setResponse != null) {
                setResponse(response.payload as QuizDataResponse)
            }
            setIsLoading(false)
            if (setStep != null) setStep(3)
        }
    }, [
        tempQuestions,
        quizDetails,
        jeopardy,
        deckId,
        dispatch,
        setResponse,
        setStep,
        setIsLoading,
    ])
    const handleChange = (
        setter: React.Dispatch<React.SetStateAction<boolean>>
    ): void => {
        setter((prev: boolean) => !prev)
    }

    const handleAddingQuestions = (): void => {
        handleChange(setSelectAll)
        dispatch(toggleAllTempQuestionsSelected(!selectAll))
    }

    const handleShowingOnlySelected = (): void => {
        handleChange(setShowOnlySelected)
    }

    const handleCollapse = (): void => {
        handleChange(setCollapseMode)
    }

    return {
        deckId,
        handleJeopardy,
        jeopardy,
        tempQuestions,
        toggleJeopardy,
        openCarousel,
        setOpenCarousel,
        collapseMode,
        setCollapseMode,
        response,
        setResponse,
        quizDetails,
        setQuizDetails,
        openQuizDetails,
        setOpenQuizDetails,
        cardSearchQuery,
        setCardSearchQuery,
        selectAll,
        setSelectAll,
        handleAddingQuestions,
        handleShowingOnlySelected,
        handleCollapse,
        showOnlySelected,
        setShowOnlySelected,
        selectedCard,
        setSelectedCard,
        isLoading,
        setIsLoading,
        handleOpenCarousel,
        step,
        setStep,
        createQuiz,
        fetchParams,
        setFetchParams,
    }
}

export { useCreateEditQuiz }
