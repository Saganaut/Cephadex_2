import SaveChestIcon from '@assets/SaveChestIcon.svg?react'
import { PageHeader } from '@common/PageHeader'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
    BaseDeckSchema,
    DeckDataResponse,
    GetSharedDeckDataResponse,
    PublicCardSchema,
} from '@source/client'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { Loading } from '@source/common/InfoComponents/Loading'
import { PageWrapper } from '@source/common/PageWrapper'
import { useMessagingModal } from '@source/lib/contexts/MessagingContext'
import { useModal } from '@source/lib/contexts/ModalContext'
import { fetchSharedDeck } from '@source/lib/store/decks/actions'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { selectCardsByDeckId } from '@store/cards/cardsSlice'
import { copySharedDeck } from '@store/decks/actions'
import { selectDeckByShareId } from '@store/decks/decksSlice'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { SharedCardContainer } from './components/SharedCardContainer'

const DeckShared: React.FC = () => {
    const { sharedDeckId } = useParams()
    const { openSignInModal } = useModal()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user.user)
    // const {
    //   isImportedDeckReadyModalOpen,
    //   openImportedDeckReadyModal,
    //   closeImportedDeckReadyModal,
    //   importedDeckId,
    //   setImportedDeckId,
    //   setImportedDeckMessage,
    // } = useDeckNotificationModal();
    const [deck, setDeck] = useState<BaseDeckSchema | null>(null)
    const [cards, setCards] = useState<PublicCardSchema[]>([])
    // const [isMessagingModalOpen, setIsMessgingModalIsOpen] = useState(false);

    const { setModalState } = useMessagingModal()
    useEffect(() => {
        const fetchDeck = async (): Promise<void> => {
            if (sharedDeckId != null) {
                const result = await dispatch(fetchSharedDeck(sharedDeckId))
                const fetchResult = result.payload as GetSharedDeckDataResponse
                if (fetchResult.decks != null) {
                    if (fetchResult.decks[0] != null) {
                        setDeck(fetchResult.decks[0])
                    }
                }
                if (fetchResult.cards != null) {
                    setCards(fetchResult.cards)
                }
            }
        }

        void fetchDeck()
    }, [dispatch, sharedDeckId])

    // const deck = useAppSelector((state) =>
    //   selectDeckByShareId(state, sharedDeckId)
    // );
    // const deckId = deck != null ? deck.id : null;
    // const cards = useAppSelector((state) => selectCardsByDeckId(state, deckId));

    const handleSaveDeck = async (): Promise<void> => {
        if (user == null) {
            openSignInModal('register')
            return
        }
        if (sharedDeckId == null) {
            return
        }

        const actionResult = (await dispatch(
            copySharedDeck(sharedDeckId)
        )) as PayloadAction<DeckDataResponse>
        const response = actionResult.payload

        const newDeckId = response.decks?.[0]?.id

        if (newDeckId == null) {
            return
        }
        setModalState({
            isOpen: true,
            message: 'Deck saved!',
            img: '',
            title: 'Success!',
            type: 'deckReady',
            optionalProps: { deckId: newDeckId },
            withFooter: false,
        })
    }
    const label = user != null ? 'Save Deck' : 'Sign Up to Save Deck'
    const CustomDetails = (): React.ReactElement => {
        return (
            <div className="pt-4">
                <StyledButton
                    style="outline"
                    onClick={handleSaveDeck}
                    label={label}
                />
            </div>
            //       <SaveChestIcon
            //         onClick={handleSaveDeck}
            //         className="  right-0 top-0 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2
            // border-blaze-orange bg-tolopea fill-blaze-orange p-1 transition-all duration-100 ease-linear hover:bg-aquamarine"
            //       />
        )
    }

    return (
        <>
            <PageWrapper>
                {' '}
                <div
                    className={'relative w-full  rounded-[18px] bg-tolopea p-4'}
                >
                    {deck != null ? (
                        <PageHeader
                            title={deck.name}
                            subtitle={deck.topic}
                            description={deck.description}
                            img={deck.img}
                            type="withImage"
                            hideCategories={true}
                            CustomDetails={CustomDetails}
                        />
                    ) : (
                        <p>Loading deck...</p>
                    )}

                    {deck == null ? (
                        <Loading />
                    ) : (
                        <>
                            <SharedCardContainer
                                cards={cards}
                                deckId={deck.id}
                                onCardClick={(event) => {}}
                            />
                        </>
                    )}
                </div>
            </PageWrapper>
        </>
    )
}

export default DeckShared
