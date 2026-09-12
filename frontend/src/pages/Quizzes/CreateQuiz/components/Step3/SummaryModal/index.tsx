import { BottomModalWrapper } from '@common/Modals/BottomModalWrapper'
import type { QuizSchema } from '@source/client'
import { formatDate } from '@utils/functions'
import React, { type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

interface SummaryModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    quiz: QuizSchema | null | undefined
}
const SummaryModal: React.FC<SummaryModalProps> = ({
    setIsOpen,
    isOpen,
    quiz,
}) => {
    if (quiz == null) return null

    return (
        <BottomModalWrapper
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            bgColor={'bg-mariana-blue'}
        >
            <div
                className={
                    'mx-auto mt-[64px] rounded-2xl border-white text-white  sm:w-4/5  sm:border-2 md:w-3/5'
                }
            >
                <div
                    className={
                        'flex w-full flex-wrap sm:flex-nowrap sm:items-center sm:justify-between'
                    }
                >
                    <Row
                        noBorder={true}
                        title={'Title'}
                        description={quiz.name ?? ''}
                    />
                    <div className="hidden sm:block">
                        <Separator />
                    </div>
                    <Row
                        noBorder={true}
                        title={'Topic'}
                        description={quiz.topic ?? 'None'}
                    />
                </div>
                <div
                    className={
                        'flex w-full  flex-wrap border-white  sm:flex-nowrap sm:items-center sm:justify-between sm:border-t-2'
                    }
                >
                    <Row
                        noBorder={true}
                        title={'Due Date'}
                        description={formatDate(quiz.dueDate ?? '') ?? 'None'}
                    />
                    <div className="hidden sm:block">
                        <Separator />
                    </div>
                    <Row
                        noBorder={true}
                        title={'Time Limit'}
                        description={quiz.timeLimit ?? 'None'}
                        className={'sm:w-2/5 sm:px-2'}
                    />
                    <div className="hidden sm:block">
                        <Separator />
                    </div>
                    <Row
                        noBorder={true}
                        title={'Marks'}
                        description={quiz.points ?? '0'}
                        className={'sm:w-2/5 sm:px-2'}
                    />
                    <div className="hidden sm:block">
                        <Separator />
                    </div>
                    <Row
                        noBorder={true}
                        title={'Questions'}
                        description={quiz.qtyQuestions ?? '0'}
                        className={'sm:w-1/2 sm:px-2'}
                    />
                </div>
                <Row title={'Subject'} description={quiz.subject ?? 'None'} />
                <Row
                    title={'Description'}
                    description={quiz.description ?? 'None'}
                />{' '}
                <Row
                    title={'Instructions'}
                    description={quiz.instructions ?? 'None'}
                />
            </div>
            <div className="absolute -bottom-px left-0 flex h-[100px] w-screen items-center justify-center rounded-t-2xl border-t-2 border-white/40 bg-tolopea sm:hidden">
                <div>
                    <button
                        className="h-10 w-36 rounded-full px-2 py-1 text-white"
                        type="button"
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </BottomModalWrapper>
    )
}
export { SummaryModal }
const Separator = (): ReactElement => {
    return <span className={'block h-full w-[4px] bg-white py-[35px]'} />
}

interface RowProps {
    title: string
    description: string | null | undefined | number
    noBorder?: boolean
    className?: string
}
const Row: React.FC<RowProps> = ({
    title,
    description,
    noBorder,
    className,
}) => {
    return (
        <div
            className={twMerge(
                'w-full px-10 py-2',
                noBorder === true ? '' : 'sm:border-t-2 border-white',
                className
            )}
        >
            <h1 className={'text-lg font-bold'}>{title}</h1>
            <p className={'text-lg'}>{description}</p>
        </div>
    )
}
