import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import React, { type Ref } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputFieldProps {
    name: string
    value: string | number | null
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void
    type: string
    placeholder: string
    label?: string
    className?: string
    setValue?: React.Dispatch<React.SetStateAction<number | null>>
    inputFieldRef?: Ref<HTMLInputElement>
    dashed?: boolean
    handleOnKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined
    textStyle?: string
}
const InputField: React.FC<InputFieldProps> = ({
    name,
    inputFieldRef,
    value,
    onChange,
    onBlur,
    type,
    placeholder,
    label,
    className,
    setValue,
    dashed,
    handleOnKeyDown,
    textStyle = '',
}) => {
    return (
        <div className={'relative w-full'}>
            {label != null && (
                <p
                    className={twMerge(
                        dashed === true
                            ? `bg-mariana-blue-100 rounded-full dark:text-white text:tolopea text-lg mb-[12px]  w-fit px-[32px] py-[4px] ${textStyle}`
                            : `pb-2 text-left sm:text-[20px] text-md font-medium dark:text-white text:tolopea ${textStyle}`
                    )}
                >
                    {label}
                </p>
            )}
            <input
                ref={inputFieldRef}
                min={1}
                autoComplete={'off'}
                className={twMerge(
                    dashed === true
                        ? `w-full appearance-none sm:text-[20px] text-md font-semibold rounded-[28px] dark:text-white text:tolopea placeholder:text-gray-400 placeholder:font-normal focus:outline-none bg-transparent py-[18px] border-[1px] border-electric-violet border-dashed px-[36px] ${textStyle}`
                        : `w-full appearance-none rounded-[18px] border-[1px] dark:border-white border-slate-400 bg-transparent px-[18px] py-[14px] text-[16px] leading-tight dark:text-white text:tolopea shadow placeholder:font-normal placeholder:text-gray-400 focus:outline-none ${textStyle}`,
                    className
                )}
                type={type}
                placeholder={placeholder}
                onBlur={onBlur}
                onChange={onChange}
                value={value ?? ''}
                name={name}
                onKeyDown={handleOnKeyDown}
            />

            {type === 'number' && setValue != null && (
                <div
                    className={
                        'absolute right-[5px] top-1/2 flex -translate-y-1/2 flex-col gap-y-[2px]'
                    }
                >
                    <div
                        onClick={() => {
                            if (value === null) {
                                setValue(1)
                            }
                            if (typeof value === 'number') {
                                setValue(value + 1)
                            }
                        }}
                        className={
                            'cursor-pointer rounded-t-full  bg-electric-violet dark:bg-tolopea'
                        }
                    >
                        <ChevronUpIcon
                            className={
                                'h-[12px] w-[18px] text-electric-violet-200'
                            }
                        />
                    </div>
                    <div
                        onClick={() => {
                            if (typeof value === 'number' && value > 1) {
                                setValue(value - 1)
                            }
                        }}
                        className={
                            'cursor-pointer rounded-b-full bg-electric-violet dark:bg-tolopea'
                        }
                    >
                        <ChevronDownIcon
                            className={
                                'h-[12px] w-[18px] text-electric-violet-200'
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export { InputField }
