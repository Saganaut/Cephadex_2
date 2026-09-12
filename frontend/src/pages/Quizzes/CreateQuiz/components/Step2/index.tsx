import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline'
import { Heading } from '@quizzes/components/Heading'
import type { CardSchema } from '@source/client'
import { Button } from '@source/common/Buttons/Button'
import { IconButton } from '@source/common/Buttons/IconButton'
import { Loading } from '@source/common/InfoComponents/Loading'
import { NotFoundComponent } from '@source/common/InfoComponents/NotFoundComponent/NotFoundComponent'
import { deleteAllCards } from '@source/lib/store/cards/cardsSlice'
import { CreateQuizCarouselModal } from '@source/pages/Quiz/EditQuiz/EditBody/components/CreateQuizCarouselModal'
import type { useCreateEditQuizResponse } from '@source/pages/Quizzes/hooks/useCreateEditQuiz'
import { useAppDispatch } from '@store/hooks'
import { setQuestions } from '@store/questions/actions'
import React, { lazy, Suspense } from 'react'

const DragAndDropQuizItem = lazy(
    async () => await import('@common/DragAndDropQuizItem')
)

export interface CardWithPoints {
    card: CardSchema
    points: number
}
interface Step2Props {
    createQuizProps: useCreateEditQuizResponse
}
const Step2: React.FC<Step2Props> = ({ createQuizProps }) => {
    const dispatch = useAppDispatch()
    // const tempQuestions = useAppSelector(selectAllTempQuestions)

    return (
        <div>
            <div className={'mb-4 flex items-center justify-between px-2'}>
                <div className="hidden sm:block">
                    <IconButton
                        icon={<ArrowLeftCircleIcon />}
                        onClick={() => {
                            createQuizProps.setStep?.(0)
                            dispatch(setQuestions([]))
                            dispatch(deleteAllCards())
                        }}
                        ariaLabel={'Go Back'}
                        to={''}
                        theme={'violet'}
                        collapse={false}
                    />
                </div>
                <h1
                    onClick={() => {
                        createQuizProps.setOpenQuizDetails(
                            !createQuizProps.openQuizDetails
                        )
                    }}
                    className={
                        'font-md cursor-pointer font-bold hover:scale-[102%] hover:opacity-90 md:text-2xl'
                    }
                >
                    {createQuizProps.quizDetails?.quizName ?? 'Name your quiz'}
                </h1>
                <Button
                    id="create-quiz-button"
                    disabled={
                        !createQuizProps.tempQuestions.some(
                            (question) => question.selected
                        ) || createQuizProps.isLoading
                    }
                    label={'Create Quiz'}
                    onClick={() => {
                        void createQuizProps.createQuiz()
                    }}
                />
            </div>
            <Heading createQuizProps={createQuizProps} />

            {/* NOTE : Always pass the whole array of data to the DragAndDrop Component
           if you need to apply pagination on it, do it inside the DragAndDrop Component,
           also don't mutate the array that we are mapping over, apply filter directly on the
           Child ( in the bellow example the Child is the SingleQuiz Component )
       */}
            <Suspense fallback={<Loading />}>
                {createQuizProps.deckId != null ? (
                    <DragAndDropQuizItem createQuizProps={createQuizProps} />
                ) : (
                    <NotFoundComponent title="Deck id not found" />
                )}
            </Suspense>
            {createQuizProps.selectedCard != null && (
                <CreateQuizCarouselModal createQuizProps={createQuizProps} />
            )}
        </div>
    )
}
export { Step2 }
