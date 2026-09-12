import 'react-datepicker/dist/react-datepicker.css'

import { RadioButton } from '@common/Form/RadioButton'
import { RadioSwitchButton } from '@common/Form/RadioSwitchButton'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { QuizDetailsModal } from '@quizzes/components/Heading/QuizDetailsModal'
import { SearchAndSort } from '@source/common/Form/SearchAndSort'
import { Tooltip } from '@source/common/Form/Tooltip'
import React from 'react'

import type { useCreateEditQuiz } from '../../hooks/useCreateEditQuiz'

const options = [
    { value: 0, label: 'none' },
    { value: 1, label: 'Category' },
    { value: 2, label: 'Question' },
    { value: 3, label: 'Points' },
]
export interface QuizData {
    quizName: string
    quizDescription: string
    quizInstructions: string
    quizSubject: string
    quizTopic: string
    timeLimit: number | null
    dueDate: Date | null
}
interface HeadingProps {
    updateQuiz?: () => void
    createQuizProps: ReturnType<typeof useCreateEditQuiz>
}

const Heading: React.FC<HeadingProps> = ({ createQuizProps, updateQuiz }) => {
    // const [sortValue, setSortValue] = useState<{
    //     value: number
    //     label: string
    // }>(options[1] as { value: number; label: string }) // THIS SHOULD BE SAFE
    // const [editedSortValue, setEditedSortValue] = useState<{
    //     value: number
    //     label: string
    // }>(options[1] as { value: number; label: string })

    // useEffect(() => {
    //     if (sortValue.label === 'Category') {
    //         setEditedSortValue({ value: 1, label: 'qType' })
    //         return
    //     }
    //     setEditedSortValue(sortValue)
    // }, [sortValue])

    return (
        <div
            id="create-quiz-heading"
            className={
                'mb-2 flex flex-wrap items-center justify-between gap-y-4 rounded-xl bg-electric-violet-200 p-4 dark:bg-mariana-blue sm:mb-8 sm:py-2 md:rounded-2xl'
            }
        >
            <div
                onClick={() => {
                    createQuizProps.setOpenQuizDetails(
                        !createQuizProps.openQuizDetails
                    )
                }}
                className={
                    'cursor-pointer rounded-full bg-white p-2 hover:bg-electric-violet'
                }
            >
                <Tooltip text={'Quiz Details'}>
                    <CalendarIcon
                        className={
                            'size-[24px] text-electric-violet hover:text-white'
                        }
                    />
                </Tooltip>
            </div>
            <RadioButton
                theme={'violet'}
                isChecked={createQuizProps.selectAll}
                handleInputChange={() => {
                    createQuizProps.handleAddingQuestions()
                }}
                label={'Select all'}
            />
            <RadioButton
                theme={'violet'}
                isChecked={createQuizProps.showOnlySelected}
                handleInputChange={() => {
                    createQuizProps.handleShowingOnlySelected()
                }}
                label={'Show Selected '}
            />
            <div
                className={
                    'min-w-[220px] rounded-[14px] p-1  dark:bg-mariana-blue sm:w-2/5 '
                }
            >
                <SearchAndSort
                    searchPlaceholder={'Search'}
                    sortOptions={options}
                    fetchParams={createQuizProps.fetchParams}
                    setFetchParams={createQuizProps.setFetchParams}
                />
            </div>
            <div className={'flex items-center gap-x-[10px]'}>
                <RadioSwitchButton
                    isChecked={createQuizProps.collapseMode}
                    handleInputChange={() => {
                        createQuizProps.handleCollapse()
                    }}
                    label={'Collapse'}
                />
                <RadioSwitchButton
                    isChecked={createQuizProps.jeopardy}
                    handleInputChange={() => {
                        createQuizProps.toggleJeopardy()
                    }}
                    label={'Jeopardy'}
                />
            </div>
            <QuizDetailsModal
                quizDetails={createQuizProps.quizDetails}
                isOpen={createQuizProps.openQuizDetails}
                setIsOpen={createQuizProps.setOpenQuizDetails}
                setQuizDetails={createQuizProps.setQuizDetails}
                updateQuiz={updateQuiz}
            />
        </div>
    )
}

export { Heading }
