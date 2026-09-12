// import type { CombinedSchema } from '@quizzes/components/SingleQuiz/Question'
import type { CardSchema } from '@source/client'
import { useToast } from '@source/lib/contexts/ToastContext'
import { useAppDispatch } from '@source/lib/store/hooks'
import { deleteOneCard } from '@store/cardInstances/actions'
import React from 'react'

import { DeleteConfirmationModal } from '..'

interface DeleteCardModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    activeCard: CardSchema | null
    deckId: string | undefined
    type: 'Quiz' | 'Study'
    handleDeleteCardFromHistory?: () => void
    // handleUpdateSchema?: (card: CombinedSchema, remove: boolean) => void
}
//NOTE: No longer using this modal to delete questions in quiz, instead we just deselect them
const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
    activeCard,
    isOpen,
    setIsOpen,
    deckId,
    handleDeleteCardFromHistory,
    // handleUpdateSchema,
    type,
}) => {
    const { postToast } = useToast()
    const dispatch = useAppDispatch()
    const handleDeleteCard = async (): Promise<void> => {
        if (activeCard == null || deckId == null) return
        try {
            const response = await dispatch(
                deleteOneCard({
                    cardId: activeCard.id,
                    deckId: parseInt(deckId),
                })
            )
            if (response.meta.requestStatus === 'fulfilled') {
                // if (handleUpdateSchema != null && type === 'Quiz') {
                //     handleUpdateSchema(activeCard, true)
                // }
                if (handleDeleteCardFromHistory != null && type === 'Study') {
                    handleDeleteCardFromHistory()
                }
            }
        } finally {
            const frenchToast = {
                message: 'Card Deleted',
                title: 'Success!',
            }
            postToast(frenchToast)
            setIsOpen(false)
        }
    }

    return (
        <DeleteConfirmationModal
            handleDelete={() => {
                void handleDeleteCard()
            }}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Delete deck"
            message="Are you sure you want to delete this card?"
        ></DeleteConfirmationModal>
    )
}
export { DeleteCardModal }
