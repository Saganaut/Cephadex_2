import PenEditIcon from '@assets/EditPenIcon.svg?react'
import TakeQuiz from '@assets/TakeQuiz.svg?react'
import { CheckIcon } from '@heroicons/react/20/solid'
import {
    PencilSquareIcon,
    QrCodeIcon,
    ShareIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@source/common/Buttons/Button'
import { IconButton } from '@source/common/Buttons/IconButton'
import { SummaryModal } from '@source/pages/Quizzes/CreateQuiz/components/Step3/SummaryModal'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AssignQuizModal } from '../../../components/AssignQuizModal'
import type { NonEmptyQuizDataResponse } from '../..'

const options: Array<{ label: string; value: string; icon?: any }> = [
    {
        label: 'Assign',
        value: 'assign',
        icon: <PencilSquareIcon className={'size-[20px] text-white'} />,
    },
    {
        label: 'Link & QR',
        value: 'generate',
        icon: <QrCodeIcon className={'size-[20px] text-white'} />,
    },
    {
        label: 'Socials',
        value: 'share',
        icon: <ShareIcon className={' size-[20px] text-white'} />,
    },
]

interface Step3Props {
    response: NonEmptyQuizDataResponse
}
const Step3: React.FC<Step3Props> = ({ response }) => {
    const [shareQuizIsOpen, setShareQuizIsOpen] = useState(false)
    // const [activeIndex, setActiveIndex] = useState(0)
    const navigate = useNavigate()
    const quizId = response?.quizzes?.[0].id
    const [isOpen, setIsOpen] = useState(false)
    const handleTakeQuiz = (): void => {
        navigate(`/quiz/${response?.quizzes?.[0].id ?? 0}`)
    }

    return (
        <div className={'flex size-full flex-col justify-center'}>
            <div
                className={
                    'relative mx-auto mb-10 flex w-fit flex-col items-center gap-y-[10px] rounded-[18px] bg-electric-violet-200 p-6 dark:bg-mariana-blue sm:min-w-[460px] sm:p-16'
                }
            >
                <div className={'absolute top-[-30px]'}>
                    <IconButton
                        icon={<CheckIcon />}
                        onClick={() => {}}
                        ariaLabel={''}
                        to={''}
                        theme={'orange'}
                        collapse={true}
                    />
                </div>
                <h1 className={'font-medium'}>
                    Your quiz was created successfully!
                </h1>
                <Button
                    label={'See summary'}
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                    className={'m-4 border-2 border-white bg-transparent'}
                />
                <div className="flex flex-wrap justify-between gap-4 p-2 sm:flex-nowrap">
                    <div
                        onClick={() => {
                            navigate(`/quiz/edit/${response?.quizzes?.[0].id}`)
                        }}
                        className="flex cursor-pointer items-center gap-x-[8px]"
                    >
                        <PenEditIcon />
                        <p> Edit</p>
                    </div>
                    <div
                        onClick={handleTakeQuiz}
                        className="flex cursor-pointer items-center gap-x-[8px]"
                    >
                        <TakeQuiz className="size-6 fill-aquamarine" />
                        <p> Take quiz</p>
                    </div>
                    <div
                        onClick={() => {
                            setShareQuizIsOpen(true)
                        }}
                        className="flex cursor-pointer items-center gap-x-[8px]"
                    >
                        <ShareIcon className="size-6 text-aquamarine" />
                        <p> Share</p>
                    </div>
                </div>
            </div>
            {/* <SharerStandard
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        options={options}
        type={"quiz"}
        itemId={response?.quizzes?.[0].id ?? 0}
      /> */}
            <AssignQuizModal
                isOpen={shareQuizIsOpen}
                setIsOpen={setShareQuizIsOpen}
                quizId={quizId}
            />
            <SummaryModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                quiz={response?.quizzes?.[0] ?? null}
            />
        </div>
    )
}
export { Step3 }
