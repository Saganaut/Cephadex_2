import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import React, { Fragment, type Ref, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface DropdownProps {
    name: string
    value?: { label: string; value: number | string }
    label?: string
    options?: Array<{ label: string; value: number | string }>
    onChange?:
        | ((value: { value: number | string; label: string }) => void)
        | ((value: { value: number | string }) => void)
        | ((value: { value: number; label: string }) => void)

    style: 'select' | 'sort'
    secondStyle?: 'shallows' | 'depths'
    dropdownRef?: Ref<HTMLInputElement>
    textStyle?: string
}

const Dropdown: React.FC<DropdownProps> = ({
    dropdownRef,
    label,
    options = [],
    name,
    style,
    onChange = () => {},
    value = { label: '', value: 0 },
    secondStyle = 'depths',
    textStyle = '',
}) => {
    const [query, setQuery] = useState('')

    // returns the options that match the query using regex
    const filteredOptions =
        query === ''
            ? options
            : options?.filter((option) =>
                  option.label
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, ''))
              )

    // Change the style of the Input based on the style prop
    const inputClassName = twMerge(
        'w-full px-[18px] font-medium dark:text-white text-tolopea focus:outline-none focus:outline-0 focus:ring-0',
        `${
            style === 'select'
                ? 'py-[14px] leading-5 text-[16px] rounded-[18px] bg-transparent border-[1px] dark:border-black-white border-slate-400'
                : `py-[8px] text-[12px] rounded-[14px] ${
                      secondStyle === 'shallows'
                          ? 'bg-aquamarine/40 dark:bg-mariana-blue-100 '
                          : 'dark:bg-tolopea bg-black-white'
                  }    `
        } ${textStyle}`
    )
    return (
        <div className="w-full">
            {/* Label */}
            {label != null && (
                <p
                    className={`pb-2 text-[20px] font-medium text-tolopea dark:text-white  ${textStyle}`}
                >
                    {label}
                </p>
            )}

            <Combobox value={value} onChange={onChange}>
                <div className="relative">
                    {/* The Input and The dropdown button */}
                    <div
                        className={`relative w-full cursor-default overflow-hidden rounded-[18px] bg-transparent text-left ${
                            style === 'select' ? 'shadow-md' : 'shadow-none'
                        } focus:outline-none  sm:text-sm`}
                    >
                        {/* Input */}
                        <Combobox.Input
                            ref={dropdownRef}
                            className={inputClassName}
                            displayValue={(option: {
                                value: number
                                label: string
                            }) => option.label}
                            name={name}
                            onChange={(event) => {
                                setQuery(event.target.value)
                            }}
                        />

                        {/* Button */}
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon
                                className={`size-[35px] text-black dark:text-aquamarine ${textStyle}`}
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>

                    {/* This is the dropdown Body, uses the Transition from headless UI for a simple animated transition */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => {
                            setQuery('')
                        }}
                    >
                        {/* Here Goes the options */}
                        <Combobox.Options className="absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {/* If there is a query and no results returns Nothing Found */}
                            {filteredOptions != null &&
                            filteredOptions.length === 0 &&
                            query !== '' ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                //   If there is a query return the matching options
                                filteredOptions?.map((option) => (
                                    //   this is the option component
                                    <Combobox.Option
                                        key={option.value}
                                        className={({ focus }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                focus
                                                    ? 'bg-aquamarine text-gray-900'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={option}
                                        onChange={() => {
                                            if (onChange != null) {
                                                onChange(option)
                                            }
                                        }}
                                    >
                                        {/* this is a render props patterncheck https://javascriptpatterns.vercel.app/patterns/react-patterns/render-props
                                         */}
                                        {({ selected, focus }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {option.label}
                                                </span>

                                                {/* Here renders a check-icon only when an option is selected */}
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            focus
                                                                ? 'text-gray-900'
                                                                : 'text-blaze-orange'
                                                        }`}
                                                    >
                                                        <CheckIcon
                                                            className="size-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    )
}
export { Dropdown }
