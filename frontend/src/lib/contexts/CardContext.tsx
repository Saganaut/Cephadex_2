import type { CardSchema } from '@source/client'
import type { CombinedSchema } from '@source/pages/Quizzes/components/CreateQuizQuestionItem/Question'
import React, { createContext, useContext, useState } from 'react'

interface CardContextProps {
    isCardStatModalOpen: boolean
    setIsCardStatModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    card: CardSchema | undefined
    setCard: React.Dispatch<React.SetStateAction<CardSchema | undefined>>
    isDeleteCardModalOpen: boolean
    setIsDeleteCardModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    deckId: number | undefined
    setDeckId: React.Dispatch<React.SetStateAction<number | undefined>>
    setIsCardCopyModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    isCardCopyModalOpen: boolean
}

interface CardContextProviderProps {
    children: React.ReactNode
}

const CardContext = createContext<CardContextProps | undefined>(undefined)

const CardContextProvider: React.FC<CardContextProviderProps> = ({
    children,
}) => {
    const [isCardStatModalOpen, setIsCardStatModalOpen] = useState(false)
    const [card, setCard] = useState<CardSchema>()
    const [isDeleteCardModalOpen, setIsDeleteCardModalOpen] = useState(false)
    const [deckId, setDeckId] = useState<number>()
    const [isCardCopyModalOpen, setIsCardCopyModalOpen] = useState(false)
    useState<(card: CombinedSchema, remove: boolean) => void>()
    return (
        <CardContext.Provider
            value={{
                isCardStatModalOpen,
                setIsCardStatModalOpen,
                card,
                setCard,
                isDeleteCardModalOpen,
                setIsDeleteCardModalOpen,
                deckId,
                setDeckId,
                isCardCopyModalOpen,
                setIsCardCopyModalOpen,
            }}
        >
            {children}
        </CardContext.Provider>
    )
}

const useCardContext = (): CardContextProps => {
    const context = useContext(CardContext)
    if (context == null) {
        throw new Error(
            'useCardContext must be used within a CardContextProvider'
        )
    }
    return context
}

export { CardContextProvider, useCardContext }
