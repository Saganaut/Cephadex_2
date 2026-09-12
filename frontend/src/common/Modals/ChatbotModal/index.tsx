import { BotMessage } from '@common/Modals/ChatbotModal/BotMessage'
import { QuestionInput } from '@common/Modals/ChatbotModal/QuestionInput'
import { UserMessage } from '@common/Modals/ChatbotModal/UserMessage'
import { Dialog, Transition } from '@headlessui/react'
import { type AskCephRequest, AskCephService } from '@source/client'
import {
    addMessage,
    clearMessages,
    type Message,
    selectChatbotMessages,
} from '@store/chatbotMessages/chatbotMessagesSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { getLatestBotMessage } from '@utils/functions'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import { ChatBotHeading } from './heading'
import { ChatBotSuggestions } from './suggestions'

interface ChatbotModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    cardId: number | undefined
    page: 'dashboard' | 'deck' | 'study'
}
export interface QuestionType {
    type: 'question' | 'wrong' | 'explain' | 'cephadex' | 'files'
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({
    setIsOpen,
    cardId,
    isOpen,
    page,
}) => {
    const [botResponse, setBotResponse] = useState('')
    const [loadingAnswer, setLoadingAnswer] = useState(false)
    const [sourceContent, setSourceContent] = useState('')
    const [pages, setPages] = useState('')
    const [fileId, setFileId] = useState('')
    const [sourceBoxOpen, setSourceBoxOpen] = useState(false)
    const dispatch = useAppDispatch()

    const messageEndRef = useRef(null)
    const chatbotMessages = useAppSelector(selectChatbotMessages)
    const handleQuestion = async (
        typeArg: QuestionType,
        searchText?: string
    ): Promise<void> => {
        setLoadingAnswer(true)
        if (searchText !== '' && searchText != null) {
            const newMessage: Message = {
                message: searchText,
                type: 'user',
                timeStamp: new Date(),
                seen: true,
            }
            dispatch(addMessage(newMessage))
        }
        setBotResponse('')

        const params: AskCephRequest = {
            question: searchText ?? '',
            latestParagraph:
                getLatestBotMessage(chatbotMessages)?.message ?? '',
            cardId: cardId ?? 0,
        }
        const response = await AskCephService.ask(typeArg.type, params)
        const processStreamResponse = (response: string): void => {
            // Split the response by "&!&" to get individual chunks
            const chunks = response
                .split('&!&')
                .map((chunk) => chunk.trim())
                .filter((chunk) => chunk)

            // Process each chunk based on its prefix
            chunks.forEach((chunk) => {
                if (chunk.startsWith('context:')) {
                    const content = chunk.substring('context:'.length).trim()
                    setSourceContent(content)
                } else if (chunk.startsWith('file_id:')) {
                    const content = chunk.substring('file_id:'.length).trim()
                    setFileId(content)
                } else if (chunk.startsWith('pages:')) {
                    const content = chunk.substring('pages:'.length).trim()
                    setPages(content)
                } else {
                    setBotResponse((prev) => prev + chunk + ' ')
                }
            })
        }

        processStreamResponse(response)
        // const { source, message } = responseData;

        // if (source) {

        // }
        // const [type, data] = response.split(/:(.+)/);
        // if (type === "mes") {
        //   setBotResponse(data);
        // }
        // if (type === "source") {
        // } else {
        //   setBotResponse(response);
        // }
        setLoadingAnswer(false)
    }

    useEffect(() => {
        dispatch(clearMessages())
    }, [cardId])

    useEffect(() => {
        if (botResponse !== '') {
            const newMessage: Message = {
                message: botResponse,
                type: 'bot',
                timeStamp: new Date(),
                seen: false,
            }
            dispatch(addMessage(newMessage))
            setBotResponse('')
        }
    }, [botResponse])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight
        }
    }, [chatbotMessages])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as={'div'}
                className={
                    'fixed   top-0 z-[9999] flex h-screen  w-full items-center justify-center sm:right-[20px]'
                }
                open={isOpen}
                onClose={() => {
                    setIsOpen(false)
                }}
            >
                <div className="fixed sm:right-[20px]">
                    <div className="flex h-screen w-screen items-center justify-center p-4 text-center sm:size-full">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={
                                    'flex items-center justify-center rounded-[18px]'
                                }
                            >
                                <div
                                    className={
                                        'mx-auto h-screen w-screen  sm:size-full'
                                    }
                                >
                                    <div
                                        className={
                                            'relative size-full bg-electric-violet-500 px-[8px]  py-[10px] dark:bg-electric-violet sm:rounded-[30px]'
                                        }
                                    >
                                        <ChatBotHeading
                                            pages={pages}
                                            setIsOpen={setIsOpen}
                                            sourceBoxOpen={sourceBoxOpen}
                                            setSourceBoxOpen={setSourceBoxOpen}
                                            fileId={fileId}
                                            sourceContent={sourceContent}
                                        />
                                        <div
                                            className={
                                                'custom-scrollbar mt-[8px] h-[91%] min-h-[50vh] overflow-y-scroll rounded-[30px] bg-white px-[14px] pb-[100px] pt-[18px] dark:bg-tolopea sm:h-[85%] sm:max-h-[500px] sm:w-[500px]'
                                            }
                                            ref={messageEndRef}
                                            style={{
                                                maskImage:
                                                    'linear-gradient(to bottom, black 0%, black 100%)',
                                                WebkitMaskImage:
                                                    'linear-gradient(to bottom, black 0%, black 100%)',
                                            }}
                                        >
                                            {chatbotMessages.map(
                                                (message, i) =>
                                                    message.type === 'bot' ? (
                                                        <BotMessage
                                                            index={i}
                                                            key={i}
                                                            message={
                                                                message.message
                                                            }
                                                            seen={message.seen}
                                                        />
                                                    ) : (
                                                        <UserMessage
                                                            key={i}
                                                            message={
                                                                message.message
                                                            }
                                                        />
                                                    )
                                            )}
                                            {loadingAnswer && (
                                                <h1>
                                                    <BotMessage
                                                        index={0}
                                                        seen={false}
                                                        message={'Thinking...'}
                                                    />
                                                </h1>
                                            )}

                                            {page === 'study' &&
                                                chatbotMessages.length < 2 && (
                                                    <ChatBotSuggestions
                                                        handleWhyWrong={() => {
                                                            void handleQuestion(
                                                                {
                                                                    type: 'wrong',
                                                                },
                                                                'Was my answer correct?'
                                                            )
                                                        }}
                                                        handleMoreInfo={() => {
                                                            void handleQuestion(
                                                                {
                                                                    type: 'explain',
                                                                },
                                                                'I want to know more...'
                                                            )
                                                        }}
                                                    />
                                                )}
                                            <QuestionInput
                                                handleQuestion={handleQuestion}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export { ChatbotModal }
