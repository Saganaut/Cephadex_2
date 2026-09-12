import type { CardType } from '@source/common/Form/CardTypeSelector/cardTypes'
import FullMarkDown from '@source/common/FullMarkDown'
import QuestionType from '@source/common/QuestionType'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

interface QuestionProps {
    question: string | null | undefined
    expanded: boolean
    type: CardType
}

const Question: React.FC<QuestionProps> = ({ question, expanded, type }) => {
    const [isExpanded, setIsExpanded] = useState(expanded)
    const maxLength = 100

    const toggleExpand = (): void => {
        setIsExpanded(!isExpanded)
    }

    const renderQuestion = (): string => {
        if (question == null) return 'No Question'
        return isExpanded || question.length <= maxLength
            ? question
            : `${question.substring(0, maxLength)}...`
    }

    const containerVariants = {
        collapsed: { borderRadius: '100px 100px 0 100px' },
        expanded: { borderRadius: '20px 20px 0 20px' },
    }

    return (
        <motion.div
            className="mx-[10px] mt-[10px] w-full cursor-pointer bg-electric-violet-200 px-[22px] py-2 text-tolopea dark:bg-electric-violet dark:text-white sm:mx-[40px]"
            onClick={toggleExpand}
            initial="collapsed"
            animate={isExpanded ? 'expanded' : 'collapsed'}
            variants={containerVariants}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="font-medium  sm:text-[20px]"
                layout
                transition={{ duration: 0.2 }}
            >
                <div className="flex gap-1">
                    <QuestionType qType={type} section={'quiz'} />
                    <FullMarkDown content={renderQuestion()} />
                </div>
            </motion.h1>
        </motion.div>
    )
}

export { Question }
