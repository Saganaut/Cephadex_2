import 'swiper/css'

import { RadioButton } from '@common/Form/RadioButton'
import { Dialog, Transition } from '@headlessui/react'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import type { CardSchema, QuestionSchema } from '@source/client'
import { Option } from '@source/pages/Quizzes/components/CreateQuizQuestionItem/Option'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { addOneQuestion } from '@store/questions/actions'
import { selectAllQuestions } from '@store/questions/questionsSlice'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'

interface CarouselModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    cards: CardSchema[]
    selectedCard: { card: CardSchema; points: number } | null
    jeopardy: boolean
}
const CarouselModal: React.FC<CarouselModalProps> = ({
    setIsOpen,
    isOpen,
    cards,
    selectedCard,
    jeopardy,
}) => {
    const swiperRef = useRef<SwiperType | null>(null)
    const dispatch = useAppDispatch()
    const questions = useAppSelector(selectAllQuestions)
    const [activeIndex, setActiveIndex] = useState(0)

    const setSwiperRef = (swiper: SwiperType): void => {
        swiperRef.current = swiper
    }
    const [isChecked, setIsChecked] = useState(false)
    const handleAddingQuestions = (card: CardSchema, points: number): void => {
        const question: QuestionSchema =
            jeopardy && card.category === 'Definitions'
                ? {
                      id: card.id,
                      question: card.content ?? '',
                      term: card.term,
                      content: card?.term ?? '',
                      qType: card?.category,
                      qOrder: questions.length,
                      points,
                      formula: card?.formula ?? '',
                      boc4: card?.boc4 ?? '',
                      boc3: card?.boc3 ?? '',
                      boc2: card?.boc2 ?? '',
                      img: card?.img ?? '',
                      promptOption: null,
                  }
                : {
                      id: card.id,
                      term: card.term,
                      question: card.term,
                      boc2: card?.boc2,
                      boc3: card?.boc3,
                      boc4: card?.boc4,
                      content: card?.content ?? '',
                      qType: card?.category,
                      qOrder: questions.length,
                      points,
                      formula: card?.formula ?? '',
                      img: card?.img ?? '',
                      promptOption: null,
                  }
        setIsChecked(!isChecked)
        dispatch(addOneQuestion(question))
    }

    useEffect(() => {
        if (activeIndex >= 0 && activeIndex < cards.length) {
            if (questions.find((q) => q.id === cards[activeIndex].id) != null) {
                setIsChecked(true)
            } else {
                setIsChecked(false)
            }
        } else {
            setIsChecked(false)
        }
    }, [activeIndex, questions, cards])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[9999]"
                onClose={() => {
                    setIsOpen(!isOpen)
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
                <div className="fixed bottom-0 h-screen w-screen overflow-hidden md:h-[70vh]">
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
                            <Dialog.Panel className="w-full overflow-hidden rounded-t-2xl bg-mariana-blue pt-[60px] text-left align-middle transition-all">
                                <div
                                    onClick={() => {
                                        setIsOpen(false)
                                    }}
                                    className={
                                        'absolute right-[20px] top-[20px] flex size-[36px] cursor-pointer  items-center justify-center rounded-full bg-tolopea'
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
                                        'absolute left-[10px]  top-[50%] z-[500] flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-tolopea md:left-[50px]'
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
                                        'absolute right-[10px]  top-[50%] z-[500] flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-tolopea md:right-[50px]'
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
                                            cards.findIndex(
                                                (card) =>
                                                    card.id ===
                                                    selectedCard?.card?.id
                                            ) ?? 0
                                        }
                                        slidesPerView={1}
                                        onSlideChange={(e) => {
                                            setActiveIndex(e.activeIndex)
                                        }}
                                    >
                                        {cards.map((card, index) => (
                                            <SwiperSlide key={index}>
                                                <div
                                                    className={
                                                        'mx-auto h-full w-[70%]'
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            'flex size-full items-center gap-x-[8px] border-b-2  border-white pb-2'
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
                                                                    selectedCard?.points ??
                                                                        1
                                                                )
                                                            }}
                                                            label={''}
                                                        />
                                                        <p
                                                            className={
                                                                'text-lg font-medium text-white'
                                                            }
                                                        >
                                                            {card.term}
                                                        </p>
                                                    </div>
                                                    {isOpen &&
                                                        card.category !==
                                                            'Mcq' && (
                                                            <div
                                                                className={
                                                                    'mx-auto w-full px-2 py-4 text-lg font-medium text-white'
                                                                }
                                                            >
                                                                <p>
                                                                    {
                                                                        card.content
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    {isOpen &&
                                                        card.category ===
                                                            'Mcq' && (
                                                            <div
                                                                className={
                                                                    'w-full py-4'
                                                                }
                                                            >
                                                                {Array.from([
                                                                    card.boc4,
                                                                    card.boc2,
                                                                    card.boc3,
                                                                    card.content,
                                                                ]).map(
                                                                    (
                                                                        value,
                                                                        index
                                                                    ) => (
                                                                        <Option
                                                                            theme={
                                                                                'transparent'
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                            content={
                                                                                value
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export { CarouselModal }
