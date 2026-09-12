import 'swiper/css'

import { RadioButton } from '@common/Form/RadioButton'
import { Dialog, Transition } from '@headlessui/react'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import type { QuestionSchema } from '@source/client'
import FullMarkDown from '@source/common/FullMarkDown'
import { selectAllTempQuestions } from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import type { useCreateEditQuizResponse } from '@source/pages/Quizzes/hooks/useCreateEditQuiz'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { addOneQuestion } from '@store/questions/actions'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'

import { DefinitionsContent } from './DefinitionsContent'
import { McqContent } from './McqContent'
// TODO jeopardy mode doesn't work in the carousel
interface CarouselModalProps {
    createQuizProps: useCreateEditQuizResponse
}
const CreateQuizCarouselModal: React.FC<CarouselModalProps> = ({
    createQuizProps,
}) => {
    const swiperRef = useRef<SwiperType | null>(null)
    const dispatch = useAppDispatch()
    const questions = useAppSelector(selectAllTempQuestions)
    const [activeIndex, setActiveIndex] = useState(0)

    const setSwiperRef = (swiper: SwiperType): void => {
        swiperRef.current = swiper
    }
    const [isChecked, setIsChecked] = useState(false)
    const handleAddingQuestions = (
        card: QuestionSchema,
        points: number
    ): void => {
        const question: QuestionSchema =
            createQuizProps.jeopardy != null && card.qType !== 'Mcq'
                ? {
                      id: card.id,
                      question: card.content ?? '',
                      term: card.term,
                      content: card?.term ?? '',
                      qType: card?.qType,
                      qOrder: questions.length,
                      points,
                      formula: card?.formula,
                      boc3: card?.boc3,
                      boc4: card?.boc4,
                      boc2: card?.boc2,
                      promptOption: card?.promptOption,
                  }
                : {
                      id: card.id,
                      term: card.term,
                      question: card.term,
                      boc2: card?.boc2,
                      boc3: card?.boc3,
                      boc4: card?.boc4,
                      content: card?.content ?? '',
                      qType: card?.qType,
                      qOrder: questions.length,
                      points,
                      formula: card?.formula,
                      promptOption: card?.promptOption,
                  }
        setIsChecked(!isChecked)
        dispatch(addOneQuestion(question))
    }
    // TODO I added cards to this useEffect when it wasn't there before - make sure this wont cause issues

    useEffect(() => {
        if (activeIndex >= 0 && activeIndex < questions.length) {
            if (
                questions.find((q) => q.id === questions[activeIndex].id) !=
                null
            ) {
                setIsChecked(true)
            } else {
                setIsChecked(false)
            }
        } else {
            setIsChecked(false)
        }
    }, [activeIndex, questions])
    return (
        <Transition appear show={createQuizProps.openCarousel} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[8888]"
                onClose={() => {
                    createQuizProps.setOpenCarousel(
                        !createQuizProps.openCarousel
                    )
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>
                <div className="fixed bottom-0 h-screen w-screen overflow-hidden sm:h-[70vh]">
                    <div className="flex min-h-full w-full text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-2000"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full overflow-hidden rounded-t-2xl bg-electric-violet-200 pt-[60px] text-left align-middle transition-all dark:bg-mariana-blue">
                                <div
                                    onClick={() => {
                                        createQuizProps.setOpenCarousel(false)
                                    }}
                                    className={
                                        'absolute right-[20px] top-[20px] flex size-[36px] cursor-pointer  items-center justify-center rounded-full bg-electric-violet-900 hover:bg-electric-violet-900/80 dark:bg-tolopea dark:hover:bg-tolopea/80 '
                                    }
                                >
                                    <XMarkIcon
                                        className={'size-[24px] text-white'}
                                    />
                                </div>

                                <div
                                    onClick={() => {
                                        swiperRef.current?.slidePrev()
                                    }}
                                    className={
                                        'absolute left-[10px] top-1/2 z-[500] flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-electric-violet-900 hover:bg-electric-violet-900/80 dark:bg-tolopea dark:hover:bg-tolopea/80  sm:left-[50px]'
                                    }
                                >
                                    <ChevronLeftIcon
                                        className={'size-[24px] text-white'}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        swiperRef.current?.slideNext()
                                    }}
                                    className={
                                        'absolute right-[10px] top-1/2 z-[500] flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-electric-violet-900 hover:bg-electric-violet-900/80  dark:bg-tolopea  dark:hover:bg-tolopea/80  sm:right-[50px]'
                                    }
                                >
                                    <ChevronRightIcon
                                        className={'size-[24px] text-white'}
                                    />
                                </div>

                                <div
                                    className={
                                        'relative flex size-full items-center'
                                    }
                                >
                                    <Swiper
                                        onInit={(swiper) => {
                                            setSwiperRef(swiper)
                                        }}
                                        spaceBetween={0}
                                        initialSlide={
                                            questions.findIndex(
                                                (card) =>
                                                    card.id ===
                                                    createQuizProps.selectedCard
                                                        ?.id
                                            ) ?? 0
                                        }
                                        slidesPerView={1}
                                        onSlideChange={(e) => {
                                            setActiveIndex(e.activeIndex)
                                        }}
                                    >
                                        {questions.map((card, index) => (
                                            <SwiperSlide key={index}>
                                                <div
                                                    className={
                                                        'mx-auto w-[70%]'
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            'flex w-full items-center gap-x-[8px]  border-b-2 border-white pb-2'
                                                        }
                                                    >
                                                        <RadioButton
                                                            theme={'violet'}
                                                            isChecked={
                                                                isChecked
                                                            }
                                                            handleInputChange={() => {
                                                                handleAddingQuestions(
                                                                    card,
                                                                    createQuizProps
                                                                        .selectedCard
                                                                        ?.points ??
                                                                        (1 as number)
                                                                )
                                                            }}
                                                            label={''}
                                                        />
                                                        <div
                                                            className={
                                                                'text-lg font-medium text-white'
                                                            }
                                                        >
                                                            <FullMarkDown
                                                                content={
                                                                    card.term ??
                                                                    'No content found'
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    {createQuizProps.openCarousel !=
                                                        null &&
                                                        card.qType !==
                                                            'Mcq' && (
                                                            <DefinitionsContent
                                                                content={
                                                                    card.content ??
                                                                    'Content not found'
                                                                }
                                                            />
                                                        )}
                                                    {createQuizProps.openCarousel !=
                                                        null &&
                                                        card.qType ===
                                                            'Mcq' && (
                                                            <McqContent
                                                                card={card}
                                                            />
                                                        )}
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <button
                                        className="absolute bottom-5 z-[9999]  h-10 w-36 rounded-full px-2 py-1 text-xl text-white sm:hidden "
                                        type="button"
                                        onClick={() => {
                                            createQuizProps.setOpenCarousel(
                                                false
                                            )
                                        }}
                                    >
                                        close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export { CreateQuizCarouselModal }
