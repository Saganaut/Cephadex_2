import { useAppDispatch } from '@source/lib/store/hooks'
import { markAsSeen } from '@store/chatbotMessages/chatbotMessagesSlice'
import React, { type ReactElement, useEffect, useState } from 'react'

import FullMarkDown from '../FullMarkDown'

const Typewriter = ({
    text,
    delay,
    index,
}: {
    text: string
    delay: number
    index: number
}): ReactElement => {
    const dispatch = useAppDispatch()
    const [currentText, setCurrentText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText((prevText) => prevText + text[currentIndex])
                setCurrentIndex((prevIndex) => prevIndex + 1)
            }, delay)

            return () => {
                clearTimeout(timeout)
            }
        }
        if (currentIndex === text.length) {
            dispatch(markAsSeen(index))
        }
    }, [currentIndex, delay, text, dispatch, index])

    return (
        <span>
            {' '}
            <FullMarkDown content={currentText} />
        </span>
    )
}

export default Typewriter
