import { SelectADeck } from '@common/SelectADeck'
import type { DeckSchema } from '@source/client'
import React, { type SetStateAction } from 'react'

interface Step1Props {
    setSelectedDeck: React.Dispatch<SetStateAction<DeckSchema | null>>
    handleTabChange?: (startStepIndex: number) => void
}

const Step1: React.FC<Step1Props> = ({ setSelectedDeck, handleTabChange }) => {
    if (handleTabChange != null) {
        handleTabChange(5)
    }
    const handleDeckClick = (deck: DeckSchema): void => {
        setSelectedDeck(deck)
    }

    return <SelectADeck withFilter={false} onDeckClick={handleDeckClick} />
}
export { Step1 }
