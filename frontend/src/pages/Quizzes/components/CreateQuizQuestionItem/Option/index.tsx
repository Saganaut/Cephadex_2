import FullMarkDown from '@source/common/FullMarkDown'
import { ExpandContentModal } from '@source/common/Modals/ExpandContentModal/ExpandContentModal'
import React from 'react'

interface OptionProps {
    content: string | null | undefined
    index: number
    theme: 'violet' | 'transparent'
}
const Option: React.FC<OptionProps> = ({ content, index, theme }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div
            className={
                'my-2 flex  w-full  items-center gap-x-[20px] rounded-full bg-mariana-blue px-2 py-[6px]'
            }
        >
            <div
                className={
                    'flex size-[42px] min-w-[42px] items-center justify-center rounded-full bg-tolopea '
                }
            >
                <h1 className={'text-[14px] font-medium text-aquamarine'}>
                    {String.fromCharCode(65 + index)}
                </h1>
            </div>

            <div
                className={`max-h-[80px] w-full overflow-hidden rounded-full ${
                    theme === 'violet' ? 'bg-electric-violet' : 'bg-transparent'
                } px-4 py-2 text-white`}
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                <FullMarkDown content={content ?? 'Content unavailable'} />
            </div>
            <ExpandContentModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                content={content ?? 'Content unavailable'}
            />
        </div>
    )
}
export { Option }
