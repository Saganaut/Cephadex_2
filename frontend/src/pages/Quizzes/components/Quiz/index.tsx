import DeleteIcon from '@assets/cardMenuIcons/DeleteIcon.svg?react'
import ShareIcon from '@assets/cardMenuIcons/ShareIcon.svg?react'
import Chevron from '@assets/Chevron.svg?react'
import EditPenIcon from '@assets/EditPenIcon.svg?react'
import InfoIcon from '@assets/InfoIcon.svg?react'
import PrintIcon from '@assets/PrintIcon.svg?react'
import { DropdownMenu } from '@common/DropdownMenu'
import { Tooltip } from '@common/Form/Tooltip'
// import { Doc } from '@quiz/PrintQuiz'
// import { pdf } from '@react-pdf/renderer'
import type { QuizSchema } from '@source/client'
import { DeleteButton } from '@source/common/Buttons/IconButtons/DeleteButton'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { DeleteConfirmationModal } from '@source/common/Modals/DeleteConfirmationModal'
import { deleteOneSharedQuiz } from '@source/lib/store/sharedQuizzes/actions'
// import { useFetchQuizAndQuestions } from '@source/pages/Quiz/useFetchQuizAndQuestions'
import { SummaryModal } from '@source/pages/Quizzes/CreateQuiz/components/Step3/SummaryModal'
import { useAppDispatch } from '@store/hooks'
import { deleteOneQuiz } from '@store/quizzes/actions'
import { formatDate } from '@utils/functions'
// import { saveAs } from 'file-saver'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DateDisplay } from '../../../../common/DateDisplay'
import { AssignQuizModal } from '../AssignQuizModal'

interface QuizProps {
    quiz: QuizSchema
    Indictaor?: boolean
    quizShareId?: string
}
const Quiz: React.FC<QuizProps> = ({ quiz, Indictaor, quizShareId }) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    // const [questions, setQuestions] = useState<QuestionSchema[] | null>(null);
    const [openAssignModal, setOpenAssignModal] = useState(false)
    // const { quizAndQuestions } = useFetchQuizAndQuestions(String(quiz.id))
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    // const handleDownload = async (): Promise<void> => {
    //     if (quizAndQuestions?.questions == null) return
    //     const blob = await pdf(
    //         <Doc questions={quizAndQuestions.questions} quiz={quiz} />
    //     ).toBlob()
    //     saveAs(blob, `${quiz.name}.pdf`)
    // }

    const handleDelete = async (): Promise<void> => {
        setDeleteModalIsOpen(true)
    }

    const reallyDelete = async (): Promise<void> => {
        if (quizShareId != null) {
            await dispatch(deleteOneSharedQuiz(quizShareId))
        } else {
            await dispatch(deleteOneQuiz(quiz.id))
        }
        setDeleteModalIsOpen(false)
    }

    const links = [
        {
            label: 'Edit',
            icon: EditPenIcon,
            type: '',
            onClick: () => {
                navigate(`/quiz/edit/${quiz.id}`)
            },
        },
        {
            label: 'Assign',
            icon: ShareIcon,
            type: '',
            onClick: () => {
                setOpenAssignModal(!openAssignModal)
            },
        },
        {
            label: 'Print',
            icon: PrintIcon,
            type: '',
            onClick: () => {
                navigate(`/quiz/print/${quiz.id}`)
            },
        },
        {
            label: 'Delete',
            icon: DeleteIcon,
            type: '',
            onClick: handleDelete,
        },
    ]
    return (
        <div
            className="relative flex w-full items-center justify-between rounded-lg bg-aquamarine-100 px-[20px] py-[8px] text-tolopea hover:bg-electric-violet-900 hover:text-white dark:bg-mariana-blue-100 dark:text-white hover:dark:bg-electric-violet md:rounded-full"
            onClick={() => {
                navigate(
                    `/quiz/hub/${quiz.id}${
                        quizShareId != null ? `?shareId=${quizShareId}` : ''
                    }`
                )
            }}
        >
            {Indictaor === true && (
                <div className="absolute right-0 top-[5px] size-[15px] rounded-full border-2 border-white bg-blaze-orange" />
            )}
            <div className="flex w-full flex-wrap items-center justify-between md:flex-nowrap">
                <div className="flex  w-full  justify-between ">
                    <h1
                        className={
                            'flex h-full w-4/5 cursor-pointer flex-wrap items-center overflow-hidden whitespace-nowrap font-bold'
                        }
                    >
                        {quiz.name}
                    </h1>
                    <div
                        className="pl-2 md:hidden"
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <DropdownMenu
                            type="Quiz"
                            button={
                                <div
                                    className={
                                        'flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-tolopea/30'
                                    }
                                >
                                    <Chevron
                                        className={
                                            'h-[10px]  w-[18px] fill-white'
                                        }
                                    />
                                </div>
                            }
                            links={links}
                        />
                    </div>
                </div>
                <div
                    className={
                        'mt-2 flex w-full items-center justify-between sm:mt-0 sm:gap-x-[12px] '
                    }
                >
                    <div className="inline-block">
                        <DateDisplay date={quiz.dueDate} />
                    </div>
                    <div
                        className={' hidden  lg:block '}
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <StyledButton
                            onClick={() => {
                                navigate(`/quiz/${quiz.id}`)
                            }}
                            label={'Take Quiz'}
                            style={'depths'}
                            size="small"
                            // className={
                            //   " hidden bg-electric-violet transition-all duration-100 ease-linear hover:scale-105 hover:bg-mariana-blue lg:block "
                            // }
                        />
                    </div>
                    <div className="md:hidden">
                        <StyledButton
                            label="Go to quiz"
                            style="outline"
                            onClick={() => {
                                navigate(
                                    `/quiz/hub/${quiz.id}${
                                        quizShareId != null
                                            ? `?shareId=${quizShareId}`
                                            : ''
                                    }`
                                )
                            }}
                        />
                    </div>
                    <Tooltip
                        text={`Created ${formatDate(quiz.timeCreated)}`}
                        position={'top'}
                    >
                        <InfoIcon
                            className={
                                'hidden size-[30px]  cursor-pointer transition-all duration-100 ease-linear hover:scale-105 hover:text-tolopea lg:block'
                            }
                        />
                    </Tooltip>
                    <div
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <div className=" hidden md:block">
                            <DropdownMenu
                                type="Quiz"
                                button={
                                    <div
                                        className={
                                            'flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-tolopea/30'
                                        }
                                    >
                                        <Chevron
                                            className={
                                                'h-[10px]  w-[18px] fill-white'
                                            }
                                        />
                                    </div>
                                }
                                links={links}
                            />
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div
                            className={
                                'flex size-[37px] cursor-pointer items-center justify-center    rounded-full border-2 border-aquamarine transition-all duration-100 ease-linear hover:scale-105'
                            }
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            <DeleteButton
                                onClick={handleDelete}
                                style="shallows"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <SummaryModal isOpen={isOpen} setIsOpen={setIsOpen} quiz={quiz} />
            <AssignQuizModal
                isOpen={openAssignModal}
                setIsOpen={setOpenAssignModal}
                quizId={quiz?.id ?? 0}
            />
            <DeleteConfirmationModal
                isOpen={deleteModalIsOpen}
                setIsOpen={setDeleteModalIsOpen}
                message={'Are you sure you want to delete this quiz?'}
                handleDelete={reallyDelete}
                title=""
            />
        </div>
    )
}
export { Quiz }
