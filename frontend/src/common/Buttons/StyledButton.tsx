import React from 'react'

interface StyledButtonProps {
    label: string
    onClick?: () => void
    disabled?: boolean
    style?: 'depths' | 'shallows' | 'vivid' | 'default' | 'outline'
    size?: 'small' | 'medium' | 'large'
    type?: 'button' | 'submit' | 'reset'
    id?: string
}
const StyledButton: React.FC<StyledButtonProps> = ({
    label,
    style,
    onClick,
    disabled,
    size = 'medium',
    type = 'button',
    id = '',
}) => {
    const disabledStyle =
        (disabled ?? false)
            ? 'cursor-not-allowed border-[1px] border-slate-400 bg-slate-300 text-opacity-30 shadow-none hover:bg-slate-300'
            : 'cursor-pointer'

    const className =
        style === 'depths'
            ? `bg-electric-violet  hover:bg-blaze-orange text-white ${disabledStyle}`
            : style === 'vivid'
              ? `bg-aquamarine hover:bg-electric-violet  text-tolopea hover:text-white ${disabledStyle}`
              : style === 'shallows'
                ? `bg-mariana-blue-100 hover:bg-electric-violet  text-white ${disabledStyle}`
                : style === 'outline'
                  ? `bg-transparent border-2 dark:border-white border-electric-violet-500 dark:text-white  text-electric-violet-700 hover:bg-aquamarine dark:hover:bg-electric-violet-900 hover:text-tolopea hover:border-transparent ${disabledStyle}`
                  : `bg-blaze-orange  hover:bg-electric-violet text-white ${disabledStyle}`

    const classSize =
        size === 'small'
            ? 'lg:px-[16px] lg:py-[6px] px-[8px] py-[4px] text-[14px]'
            : size === 'medium'
              ? 'lg:px-[30px] lg:py-[12px] px-[15px] py-[4px] text-[18px]'
              : 'lg:px-[60px] lg:py-[24px] px-[30px] py-[8px] text-[24px]'

    return (
        <button
            id={id}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={` whitespace-nowrap rounded-full font-medium transition-transform duration-100 ${className} ${classSize}`}
        >
            {label}
        </button>
    )
}

export { StyledButton }
