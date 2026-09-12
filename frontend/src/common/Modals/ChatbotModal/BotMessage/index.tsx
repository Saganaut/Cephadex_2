import ChatbotIcon from '@assets/Chatbot.svg'
import Typewriter from '@common/Typewriter'
import FullMarkDown from '@source/common/FullMarkDown'
import React from 'react'

interface BotMessageProps {
    message: string
    index: number
    seen: boolean
}
const BotMessage: React.FC<BotMessageProps> = ({ message, index, seen }) => {
    return (
        <>
            {message !== '' && (
                <div className={'mb-[14px]'}>
                    <img alt={''} src={ChatbotIcon} className={'w-[36px]'} />
                    <div>
                        <p
                            className={
                                'pb-[4px] text-left text-[10px] font-medium text-electric-violet-200'
                            }
                        >
                            Teacher Tentacles
                        </p>
                        <div
                            className={
                                ' rounded-[0px_20px_20px_20px]  bg-aquamarine-100 px-[12px] py-[8px] text-left text-sm text-tolopea dark:bg-mariana-blue dark:text-white'
                            }
                        >
                            {!seen ? (
                                <Typewriter
                                    index={index}
                                    text={message}
                                    delay={0}
                                />
                            ) : (
                                <FullMarkDown content={message} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export { BotMessage }
