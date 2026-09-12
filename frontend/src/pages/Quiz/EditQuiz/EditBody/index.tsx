import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import { Heading, type QuizData } from '@quizzes/components/Heading'
import {
    type QuizRequestSchema,
    type QuizSchema,
    QuizService,
} from '@source/client'
import { Button } from '@source/common/Buttons/Button'
import { IconButton } from '@source/common/Buttons/IconButton'
import { Loading } from '@source/common/InfoComponents/Loading'
import { NotFoundComponent } from '@source/common/InfoComponents/NotFoundComponent/NotFoundComponent'
import { updateOneQuiz } from '@source/lib/store/quizzes/actions'
import type { TempQuestionSchema } from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import { useCreateEditQuiz } from '@source/pages/Quizzes/hooks/useCreateEditQuiz'
import type { NonEmptyArray } from '@source/types'
import { useAppDispatch } from '@store/hooks'
import { setQuestions } from '@store/questions/actions'
import React, { lazy, Suspense, useEffect, useState } from 'react'

import { CreateQuizCarouselModal } from './components/CreateQuizCarouselModal'

const DragAndDropQuizItem = lazy(
    async () => await import('@common/DragAndDropQuizItem')
)
interface EditBodyProps {
    orderedCards: NonEmptyArray<TempQuestionSchema>
    QuizDetails: QuizData | null
    Quiz: QuizSchema | null
}
const EditBody: React.FC<EditBodyProps> = ({
    orderedCards,
    QuizDetails,
    Quiz,
}) => {
    const dispatch = useAppDispatch()
    const [selectedCard, setSelectedCard] = useState<TempQuestionSchema>(
        orderedCards[0]
    )
    const handleOpenCarousel = (Card: TempQuestionSchema): void => {
        setOpenCarousel(true)
        setSelectedCard(Card)
    }
    const {
        quizDetails,
        setQuizDetails,
        openCarousel,
        toggleJeopardy,
        jeopardy,
        setCollapseMode,
        collapseMode,
        setOpenCarousel,
        setOpenQuizDetails,
        openQuizDetails,
        selectAll,
        showOnlySelected,
        setShowOnlySelected,
        setSortedArray,
        setSelectAll,
        setCardSearchQuery,
        sortedArray,
        cardSearchQuery,
    } = useCreateEditQuiz()

    useEffect(() => {
        if (QuizDetails == null) return
        setQuizDetails(QuizDetails)
    }, [QuizDetails, setQuizDetails])

    const updateQuiz = async (
        orderedCards: TempQuestionSchema[],
        quizDetails: QuizData | null
    ): Promise<void> => {
        if (Quiz == null) return
        try {
            // Delete Unselected Questions First
            const deletedQuestionsIds = orderedCards
                .filter((card) => !card.selected)
                .map((card) => card.id)

            await QuizService.deleteQuestionsFromQuiz(Quiz?.id, {
                ids: deletedQuestionsIds,
            })

            const dueDate =
                quizDetails?.dueDate?.toISOString().split('T')[0] +
                'T' +
                ('0' + quizDetails?.dueDate?.getHours()).slice(-2) +
                ':' +
                ('0' + quizDetails?.dueDate?.getMinutes()).slice(-2) +
                ':' +
                ('0' + quizDetails?.dueDate?.getSeconds()).slice(-2)
            const quizBody = {
                deckId: Quiz.deckId,
                description: quizDetails?.quizDescription ?? Quiz?.description,
                name: quizDetails?.quizName ?? Quiz?.name,
                instructions:
                    quizDetails?.quizInstructions ?? Quiz?.instructions,
                topic: quizDetails?.quizTopic ?? Quiz?.topic,
                subject: quizDetails?.quizSubject ?? Quiz?.subject,
                numQuestions: orderedCards.length,
                dueDate: dueDate ?? Quiz?.dueDate,
                jeopardy,
                points: orderedCards.reduce((acc, curr) => {
                    return acc + (curr.points ?? 0)
                }, 0),
                // dueDate: "20",

                timeLimit: quizDetails?.timeLimit,
                questions: orderedCards,
            }

            if (quizBody.deckId != null) {
                await dispatch(
                    updateOneQuiz({
                        quizId: Quiz?.id,
                        quiz: quizBody as QuizRequestSchema, // This should be safe as checked for deckId above
                    })
                )
            }
        } catch (error) {}
    }

    return (
        <div>
            <div
                className={
                    'mb-2 flex flex-wrap items-center justify-end px-2 sm:mb-4 sm:flex-nowrap sm:justify-between sm:px-1'
                }
            >
                <div className="hidden sm:block">
                    <IconButton
                        icon={<ArrowLeftCircleIcon />}
                        onClick={() => {
                            dispatch(setQuestions([]))
                        }}
                        ariaLabel={'Go Back'}
                        to={'/quizzes'}
                        theme={'violet'}
                        collapse={false}
                    />
                </div>

                <Button
                    label={'Update Quiz'}
                    onClick={() => {
                        void updateQuiz(orderedCards, quizDetails)
                    }}
                />
            </div>
            <Heading
                open={openQuizDetails}
                setOpen={setOpenQuizDetails}
                quizDetails={quizDetails}
                setQuizDetails={setQuizDetails}
                selectAll={selectAll}
                toggleJeopardy={toggleJeopardy}
                jeopardy={jeopardy}
                collapseMode={collapseMode}
                setCollapseMode={setCollapseMode}
                showOnlySelected={showOnlySelected}
                setShowOnlySelected={setShowOnlySelected}
                data={orderedCards}
                setSortedArray={setSortedArray}
                setSelectAll={setSelectAll}
                setCardSearchQuery={setCardSearchQuery}
                updateQuiz={() => {
                    void updateQuiz(orderedCards, quizDetails)
                }}
            />

            {/* NOTE : Always pass the whole array of data to the DragAndDrop Component
           if you need to apply pagination on it, do it inside the DragAndDrop Component,
           also don't mutate the array that we are mapping over, apply filter directly on the
           Child ( in the bellow example the Child is the SingleQuiz Component )
       */}
            <Suspense fallback={<Loading />}>
                {Quiz?.deckId != null ? (
                    <DragAndDropQuizItem
                        collapseMode={collapseMode}
                        handleOpenCarousel={handleOpenCarousel}
                        jeopardy={jeopardy}
                        showOnlySelected={showOnlySelected}
                        tempQuestionsArray={sortedArray}
                        searchQuery={cardSearchQuery}
                        deckId={Quiz?.deckId}
                        setSortedArray={setSortedArray}
                    />
                ) : (
                    <NotFoundComponent title="Deck id not found" />
                )}
            </Suspense>
            <CreateQuizCarouselModal
                jeopardy={jeopardy}
                selectedCard={selectedCard}
                isOpen={openCarousel}
                setIsOpen={setOpenCarousel}
                cards={orderedCards}
            />
        </div>
    )
}
export { EditBody }
