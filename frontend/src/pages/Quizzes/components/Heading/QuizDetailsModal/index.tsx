import QuizPoints from '@assets/quizIcons/QuizPoints.svg?react'
import QuizQuestionsMark from '@assets/quizIcons/QuizQuestionMark.svg?react'
import { InputField } from '@common/Form/InputField'
import { TextAreaField } from '@common/Form/TextAreaField'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { QuizData } from '@quizzes/components/Heading'
import { Button } from '@source/common/Buttons/Button'
import { Tooltip } from '@source/common/Form/Tooltip'
import { selectAllTempQuestions } from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import { useAppSelector } from '@store/hooks'
import { selectAllQuestions } from '@store/questions/questionsSlice'
import { Formik, type FormikHelpers } from 'formik'
import React, { Fragment, useEffect } from 'react'
import DatePicker from 'react-datepicker'

interface QuizDetailsModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setQuizDetails: React.Dispatch<React.SetStateAction<QuizData | null>>
    quizDetails: QuizData | null
    updateQuiz?: () => void
}
const QuizDetailsModal: React.FC<QuizDetailsModalProps> = ({
    setQuizDetails,
    isOpen,
    setIsOpen,
    quizDetails,
    updateQuiz,
}) => {
    const [detailsSet, setDetailsSet] = React.useState(false)
    const questions = useAppSelector(selectAllTempQuestions)

    const selectedQuestions = questions.filter((question) => question.selected)

    useEffect(() => {
        if (detailsSet) {
            if (updateQuiz !== undefined) {
                updateQuiz()
                setDetailsSet(false)
            }
        }
    }, [detailsSet, updateQuiz])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <div className="absolute left-0 top-0 w-screen">
                {/* OVERLAY */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        onClick={() => {
                            setIsOpen(false)
                        }}
                        className="fixed inset-0 z-[200] bg-black/25"
                    />
                </Transition.Child>
                <div className="fixed bottom-0 left-0 z-[250] w-screen overflow-hidden">
                    <div className="flex w-full text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="translate-y-[100%]"
                            enterTo="translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-full"
                        >
                            <div className="relative z-[250] h-screen w-full overflow-hidden rounded-t-2xl  text-left align-middle transition-all md:h-[90vh] md:pt-[60px]">
                                <div
                                    className={
                                        'relative size-full bg-electric-violet-200 px-[20px] dark:bg-mariana-blue md:px-[126px]'
                                    }
                                >
                                    <div
                                        onClick={() => {
                                            setIsOpen(false)
                                        }}
                                        className={
                                            'absolute right-[20px] top-[20px] flex size-[36px] cursor-pointer  items-center justify-center rounded-full bg-tolopea hover:bg-tolopea/60'
                                        }
                                    >
                                        <XMarkIcon
                                            className={'size-[24px] text-white'}
                                        />
                                    </div>
                                    <Formik
                                        className={'size-full'}
                                        initialValues={{
                                            quizName:
                                                quizDetails?.quizName ?? '',
                                            quizDescription:
                                                quizDetails?.quizDescription ??
                                                '',
                                            quizInstructions:
                                                quizDetails?.quizInstructions ??
                                                '',
                                            quizSubject:
                                                quizDetails?.quizSubject ?? '',
                                            quizTopic:
                                                quizDetails?.quizTopic ?? '',
                                            timeLimit:
                                                quizDetails?.timeLimit ?? 60,
                                            dueDate:
                                                quizDetails?.dueDate ?? null,
                                        }}
                                        onSubmit={(
                                            values: QuizData,
                                            {
                                                setSubmitting,
                                            }: FormikHelpers<QuizData>
                                        ) => {
                                            setQuizDetails(values)
                                            setDetailsSet(true)
                                        }}
                                    >
                                        {(props) => (
                                            <div>
                                                <div
                                                    className={
                                                        'mb-2 flex w-full flex-wrap items-center justify-between gap-x-[20px] pt-[50px] md:mb-8 md:flex-nowrap md:pt-[64px]'
                                                    }
                                                >
                                                    <InputField
                                                        label={'Name'}
                                                        name={'quizName'}
                                                        value={
                                                            props.values
                                                                .quizName
                                                        }
                                                        onChange={
                                                            props.handleChange
                                                        }
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                        type={'text'}
                                                        placeholder={
                                                            'Enter a name for the quiz...'
                                                        }
                                                        textStyle="dark:text-white text-tolopea"
                                                    />

                                                    <div className="mt-[10px] flex flex-nowrap gap-2">
                                                        <div>
                                                            <h1
                                                                className={
                                                                    'text-tolopea dark:text-white'
                                                                }
                                                            >
                                                                Due Date
                                                            </h1>
                                                            <DatePicker
                                                                id={'dueDate'}
                                                                className={
                                                                    'w-full rounded-[18px] border-2 border-slate-400 bg-transparent px-[10px] py-[6px] dark:border-white dark:text-white'
                                                                }
                                                                name={'dueDate'}
                                                                showTimeSelect
                                                                selected={
                                                                    props.values
                                                                        .dueDate
                                                                }
                                                                onChange={async (
                                                                    date
                                                                ) =>
                                                                    await props.setFieldValue(
                                                                        'dueDate',
                                                                        date
                                                                    )
                                                                }
                                                                dateFormat="Pp"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p
                                                                className={
                                                                    'text-tolopea dark:text-white'
                                                                }
                                                            >
                                                                Time Limit
                                                            </p>
                                                            <div
                                                                className={
                                                                    'w-[100px]'
                                                                }
                                                            >
                                                                <InputField
                                                                    name={
                                                                        'timeLimit'
                                                                    }
                                                                    setValue={async (
                                                                        value: number
                                                                    ) =>
                                                                        await props.setFieldValue(
                                                                            'timeLimit',
                                                                            value
                                                                        )
                                                                    }
                                                                    value={
                                                                        props
                                                                            .values
                                                                            .timeLimit ??
                                                                        60
                                                                    }
                                                                    onChange={
                                                                        props.handleChange
                                                                    }
                                                                    onBlur={
                                                                        props.handleBlur
                                                                    }
                                                                    type={
                                                                        'number'
                                                                    }
                                                                    placeholder={
                                                                        '60'
                                                                    }
                                                                    className={
                                                                        'w-[100px] rounded-[18px] px-[10px] py-[6px] text-center'
                                                                    }
                                                                    textStyle="dark:text-white text-tolopea"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className={
                                                        'mb-2 flex-row-reverse flex-wrap items-center justify-between  gap-x-[30px] sm:flex sm:flex-row sm:flex-nowrap md:mb-8 md:flex-nowrap'
                                                    }
                                                >
                                                    <InputField
                                                        label={'Subject'}
                                                        name={'quizSubject'}
                                                        value={
                                                            props.values
                                                                .quizSubject
                                                        }
                                                        onChange={
                                                            props.handleChange
                                                        }
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                        type={'text'}
                                                        placeholder={
                                                            'Enter a subject for the quiz...'
                                                        }
                                                        textStyle="dark:text-white text-tolopea"
                                                    />
                                                    <InputField
                                                        label={'Topic'}
                                                        name={'quizTopic'}
                                                        value={
                                                            props.values
                                                                .quizTopic
                                                        }
                                                        onChange={
                                                            props.handleChange
                                                        }
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                        type={'text'}
                                                        placeholder={
                                                            'Enter a topic for the quiz...'
                                                        }
                                                        textStyle="dark:text-white text-tolopea"
                                                    />
                                                    <div
                                                        className={
                                                            'mx-auto mt-[20px] flex h-full w-3/5 items-center justify-end gap-x-[40px] '
                                                        }
                                                    >
                                                        <div className="flex items-center gap-1 text-xl">
                                                            {selectedQuestions.reduce(
                                                                (acc, curr) => {
                                                                    return (
                                                                        acc +
                                                                        (curr.points ??
                                                                            1)
                                                                    )
                                                                },
                                                                0
                                                            )}
                                                            <Tooltip
                                                                text={'points'}
                                                            >
                                                                <QuizPoints
                                                                    className={
                                                                        'size-[24px]  '
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-xl">
                                                            {
                                                                selectedQuestions.length
                                                            }
                                                            <Tooltip
                                                                text={
                                                                    'questions'
                                                                }
                                                            >
                                                                <QuizQuestionsMark
                                                                    className={
                                                                        'size-[24px]  '
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={'mb-2 md:mb-8 '}
                                                >
                                                    <InputField
                                                        label={'Description'}
                                                        name={'quizDescription'}
                                                        value={
                                                            props.values
                                                                .quizDescription
                                                        }
                                                        onChange={
                                                            props.handleChange
                                                        }
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                        type={'text'}
                                                        placeholder={
                                                            'Enter a description for the quiz...'
                                                        }
                                                        textStyle="dark:text-white text-tolopea"
                                                    />
                                                </div>
                                                <div>
                                                    <TextAreaField
                                                        label={'Instructions'}
                                                        name={
                                                            'quizInstructions'
                                                        }
                                                        value={
                                                            props.values
                                                                .quizInstructions
                                                        }
                                                        onChange={
                                                            props.handleChange
                                                        }
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                        type={'text'}
                                                        placeholder={
                                                            'Enter an Instructions for the quiz...'
                                                        }
                                                        textStyle="dark:text-white text-tolopea"
                                                    />
                                                </div>

                                                <Button
                                                    className={
                                                        'ml-auto mt-6 block'
                                                    }
                                                    label={'Save'}
                                                    onClick={() => {
                                                        setIsOpen(false)
                                                        props.handleSubmit()
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                    <button
                        className="absolute bottom-5 z-[9999]  h-10 w-36 rounded-full px-2 py-1 text-xl text-white sm:hidden "
                        type="button"
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        close
                    </button>
                </div>
            </div>
        </Transition>
    )
}
export { QuizDetailsModal }
