import { motion } from 'framer-motion'
import React from 'react'

interface ProgressCircleProps {
    percents?: number
    stroke?: string
    duration?: number
    delay?: number
    strokeWidth?: number
    seconds?: number
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const parts = []
    if (hours > 0) {
        parts.push(hours < 10 ? `0${hours}` : hours.toString())
    }
    if (minutes > 0 || hours > 0) {
        parts.push(minutes < 10 ? `0${minutes}` : minutes.toString())
    }
    parts.push(
        remainingSeconds < 10
            ? `0${remainingSeconds}`
            : remainingSeconds.toString()
    )

    return parts.join(':')
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
    percents = 0,
    stroke = 'white',
    duration,
    seconds,
    strokeWidth = 2,
}) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const fillPercents = Math.abs(
        Math.ceil((circumference / 100) * (percents - 100))
    )

    const transition = {
        duration,
        ease: 'linear',
    }

    const variants = {
        hidden: {
            strokeDashoffset: circumference,
            transition,
        },
        show: {
            strokeDashoffset: percents,
            transition,
        },
    }

    return (
        <div
            className={
                'relative flex size-11 items-center justify-center sm:size-[60px]'
            }
        >
            <h1
                className={
                    'absolute left-1/2 top-[11px] -translate-x-1/2 font-bold sm:top-[17px] sm:text-lg'
                }
            >
                {duration !== null ? formatTime(seconds ?? 0) : '∞'}
            </h1>
            <svg
                viewBox="0 0 100 100"
                style={{
                    position: 'absolute',
                    transform: 'rotate(-90deg)',
                    overflow: 'visible',
                }}
            >
                <motion.circle
                    cx={50}
                    cy={50}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={stroke}
                    fill="transparent"
                    strokeDashoffset={circumference}
                    strokeDasharray={fillPercents}
                    variants={variants}
                    initial="show"
                    animate={'hidden'}
                />
            </svg>
        </div>
    )
}
export { ProgressCircle }
