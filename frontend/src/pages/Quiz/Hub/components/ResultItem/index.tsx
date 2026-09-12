import CalenderIcon from '@assets/CalendarIcon.svg?react'
import CheckMarkIcon from '@assets/CheckIcon.svg?react'
import InfoIcon from '@assets/InfoIcon.svg?react'
import type { QuizResultSchema } from '@source/client'
import { DeleteButton } from '@source/common/Buttons/IconButtons/DeleteButton'
import { DeleteConfirmationModal } from '@source/common/Modals/DeleteConfirmationModal'
import { useAppDispatch } from '@source/lib/store/hooks'
import { deleteOneQuizResult } from '@source/lib/store/quizResults/actions'
import { formatDate } from '@source/lib/utils/functions'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ResultItemProps {
    result: QuizResultSchema
    quizId: string
}

const ResultItem: React.FC<ResultItemProps> = ({ result, quizId }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const handleDelete = (): void => {
        if (result.id == null) return
        void dispatch(deleteOneQuizResult(result.id))
        setIsOpen(false)
    }
    return (
        <div
            onClick={() => {
                navigate(`/quiz/${quizId}/result/${result.id}`)
            }}
            className="mt-[16px] flex cursor-pointer items-center justify-between rounded-lg bg-aquamarine/70  px-[20px] py-[10px] text-tolopea hover:bg-aquamarine-900 dark:bg-mariana-blue dark:text-white dark:hover:bg-mariana-blue-100 sm:px-[40px] sm:py-[14px] md:rounded-2xl"
        >
            <h1 className="font-medium">{result.takerUsername}</h1>
            <div className="flex items-center gap-x-[16px]">
                <div className="flex items-center gap-x-[16px]">
                    <p>Points</p>
                    <div className="flex items-center rounded-full border border-tolopea/40 p-[2px] dark:border-white">
                        <p className="px-[20px] font-medium">{result.points}</p>
                        <div className="flex size-[30px] items-center justify-center rounded-full bg-blaze-orange">
                            <CheckMarkIcon />
                        </div>
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="flex items-center gap-x-[8px]  rounded-full bg-white px-[18px] py-[6px]">
                        <CalenderIcon />
                        <p className="font-medium text-tolopea">
                            {formatDate(result.startTime ?? '')}
                        </p>
                    </div>
                </div>
                <div className="hidden md:block">
                    <InfoIcon />
                </div>
                <div className="hidden md:block">
                    <div
                        className="flex size-[38px] items-center justify-center  rounded-full bg-mariana-blue-100"
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <DeleteButton
                            style="shallows"
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        />
                    </div>{' '}
                </div>

                <DeleteConfirmationModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    handleDelete={handleDelete}
                    title="Are you sure you want to delete this result?"
                    message="Neither the quiz taker nor the creator will have access to this result if you do so."
                />
            </div>
        </div>
    )
}
export { ResultItem }
