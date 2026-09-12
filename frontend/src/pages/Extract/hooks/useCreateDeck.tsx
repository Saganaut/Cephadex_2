import {
    CreateService,
    type ExtractResponse,
    UserService,
} from '@source/client'
import { useDeckNotificationContext } from '@source/lib/contexts/DeckNotificationContext'
import { useMessagingModal } from '@source/lib/contexts/MessagingContext'
import { useFetchUser } from '@source/lib/hooks/userHooks/useFetchUser'
import { useAppDispatch } from '@source/lib/store/hooks'
import { refreshUserData } from '@source/lib/store/user/actions'
import { useEffect, useState } from 'react'

import type ExtractFormValues from '../data/ExtractFormValues'
import { processData } from '../functions/functions'

const createDeck = async (bodyExtract: {
    data: string
    file: File
}): Promise<ExtractResponse> => {
    const response = await CreateService.extract(bodyExtract)
    return response
}
const useCreateDeck = (): {
    handleInsufficientCredit: () => void
    updateUserBalance: () => Promise<void>
    totalSteps: number
    creditCost: number
    setCreditCost: (value: number) => void
    step: number
    setStep: (value: number) => void
    handleCreateNewDeck: (values: ExtractFormValues) => Promise<void>
    remainingCredit: number
    selectedFileName: string
    setSelectedFileName: (value: string) => void
    creditLoading: boolean
    setCreditLoading: (value: boolean) => void
} => {
    const { user } = useFetchUser()
    const [remainingCredit, setRemainingCredit] = useState(
        user.remainingCredit ?? 0
    )
    const dispatch = useAppDispatch()
    const [step, setStep] = useState(1)
    const totalSteps = 3
    const [selectedFileName, setSelectedFileName] = useState('')
    const [creditCost, setCreditCost] = useState(0)
    const [creditLoading, setCreditLoading] = useState(false)
    const { setModalState } = useMessagingModal()
    const {
        slug,
        setSlug,
        setIsCreatingDeck,
        setCreatingStatus,
        setDeckId,
        initializeWebSocket,
        socketRef,
    } = useDeckNotificationContext()
    const openMessagingModal = (): void => {
        setModalState({
            isOpen: true,
            message: "You don't have enough credit to create a deck",
            img: '',
            title: 'Insufficient Credit',
            type: 'insufficientCredit',
            optionalProps: {},
            withFooter: true,
        })
    }
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const res = await UserService.remainingCredit()
            setRemainingCredit(res.usageRecords[0]?.remainingCredit ?? 0)
        }

        void fetchData()
    }, [dispatch])

    const handleInsufficientCredit = (): void => {
        openMessagingModal()
    }

    const updateUserBalance = async (): Promise<void> => {
        void dispatch(refreshUserData('credit'))
    }

    useEffect(() => {
        if (slug != null) {
            initializeWebSocket()
        }
    }, [slug])

    const handleCreateNewDeck = async (
        values: ExtractFormValues
    ): Promise<void> => {
        setCreatingStatus('loading')
        const newValues = processData(values)
        try {
            const response = await createDeck(newValues)

            if (response.message === 'Insufficient credit') {
                handleInsufficientCredit()
                return
            }
            setSlug(response.slug)
            setDeckId(String(response.deckId))
            void updateUserBalance()
            setIsCreatingDeck(true)
        } catch (error) {
            setStep(1)
            setIsCreatingDeck(false)
            setCreatingStatus('idle')
            if (socketRef.current != null) {
                socketRef.current.close()
            }
            setModalState({
                isOpen: true,
                message:
                    'We encountered an unexpected error.  We have been notified and will investigate.  Please try again or contact support.  Thank you.',
                img: '',
                title: 'Unexpected Error',
                type: 'error',
                optionalProps: {},
                withFooter: true,
            })
        }
    }

    return {
        step,
        setStep,
        totalSteps,
        creditCost,
        setCreditCost,
        handleInsufficientCredit,
        updateUserBalance,
        handleCreateNewDeck,
        remainingCredit,
        selectedFileName,
        setSelectedFileName,
        creditLoading,
        setCreditLoading,
    }
}

export { useCreateDeck }
