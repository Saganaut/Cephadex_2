import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    PlusIcon,
} from '@heroicons/react/20/solid'
import { IconButton } from '@source/common/Buttons/IconButton'
import { useDeckContexts } from '@source/lib/contexts/DeckContexts'
import React, { useEffect } from 'react'

interface DeckControlsProps {
    deckId: number
}

const DeckControls: React.FC<DeckControlsProps> = ({ deckId }) => {
    const {
        setDeckId,
        setImportDeckModalIsOpen,
        setNewCardModalIsOpen,
        setExportDeckModalIsOpen,
    } = useDeckContexts()
    // setDeckId(deckId);

    useEffect(() => {
        setDeckId(deckId)
    }, [deckId, setDeckId])

    const buttonsClassName =
        'dark:bg-mariana-blue py-[4px] px-3 text-[16px] mx-1 h-8'

    return (
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center ">
            <h4 className="me-2 ml-3 mt-4 text-2xl font-semibold text-black dark:text-white sm:m-0">
                Cards
            </h4>
            <div className="flex flex-wrap items-center gap-[20px] p-2">
                <div className="flex gap-2">
                    <IconButton
                        iconClassName="h-5 w-5"
                        classname={buttonsClassName}
                        icon={<PlusIcon className="size-5" />}
                        onClick={() => {
                            setNewCardModalIsOpen(true)
                        }}
                        ariaLabel="Add"
                        to=""
                        theme={'orange'}
                        collapse={false}
                        onlyIconOnMobile={true}
                    />
                    <IconButton
                        iconClassName="h-5 w-5"
                        classname={buttonsClassName}
                        icon={<ArrowUpTrayIcon />}
                        onClick={() => {
                            setImportDeckModalIsOpen(true)
                        }}
                        ariaLabel="Import"
                        to=""
                        theme={'orange'}
                        collapse={false}
                        onlyIconOnMobile={true}
                    />
                    <IconButton
                        iconClassName="h-5 w-5"
                        classname={buttonsClassName}
                        icon={<ArrowDownTrayIcon />}
                        onClick={() => {
                            setExportDeckModalIsOpen(true)
                        }}
                        ariaLabel="Export"
                        to=""
                        theme={'orange'}
                        collapse={false}
                        onlyIconOnMobile={true}
                    />
                </div>
            </div>
        </div>
    )
}

export { DeckControls }
