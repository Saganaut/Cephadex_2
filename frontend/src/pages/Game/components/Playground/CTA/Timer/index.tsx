import { GameStatus } from '@source/client'
import { ProgressCircle } from '@source/common/Animations/ProgressCircle'
import type { ITimerState } from '@source/types'
import React from 'react'

interface TimerProps {
    initialSeconds: number
    setTimerState: React.Dispatch<React.SetStateAction<ITimerState>>
    timerState: ITimerState
    gameState?: GameStatus
    seconds: number
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return [hours, minutes, remainingSeconds]
        .map((val) => (val < 10 ? `0${val}` : val))
        .join(':')
}

const Timer: React.FC<TimerProps> = ({
    initialSeconds,
    timerState,
    setTimerState,
    gameState,
    seconds,
}) => {
    return (
        <div className={'flex flex-col items-center'}>
            {/* {timerState.state === "idle" && (
        <MdOutlineTimer className={"h-[32px] w-[32px] text-white"} />
      )} */}
            {timerState.state === 'idle' && (
                // <h1 className={"text-center"}>
                //   {initialSeconds != null && initialSeconds > 0
                //     ? (seconds !== 0 ? seconds : initialSeconds) + " seconds"
                //     : "∞"}
                // </h1>
                <ProgressCircle
                    percents={100}
                    seconds={seconds}
                    strokeWidth={8}
                    duration={initialSeconds}
                />
            )}

            {gameState === GameStatus.ANSWERING &&
                timerState.state === 'going' && (
                    <>
                        <ProgressCircle
                            seconds={seconds}
                            strokeWidth={8}
                            duration={initialSeconds}
                            // Optionally add a prop for formatted time if the ProgressCircle component can benefit from it
                        />
                    </>
                )}
            {gameState === GameStatus.VOTING &&
                timerState.state === 'going' && (
                    <ProgressCircle
                        seconds={seconds}
                        strokeWidth={8}
                        duration={initialSeconds}
                        // Same as above
                    />
                )}
            {timerState.context === 'quiz' && timerState.state === 'going' && (
                <ProgressCircle
                    seconds={seconds}
                    strokeWidth={8}
                    duration={initialSeconds}
                    // Same as above
                />
            )}
        </div>
    )
}

export { Timer }
