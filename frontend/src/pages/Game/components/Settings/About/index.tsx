import FullMarkDown from '@source/common/FullMarkDown'
import React, { type ReactElement, useState } from 'react'

interface aboutProps {
    gameInfo: { intro: string; rules: string }
}

const About = ({ gameInfo }: aboutProps): ReactElement => {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className={'mt-6 px-6 sm:mt-10 sm:px-[60px]'}>
            <h1
                className={
                    'mb-8 text-lg font-semibold text-aquamarine sm:text-white'
                }
            ></h1>
            <div className={'my-4'}>
                <div className={`pb-10`}>{gameInfo.intro}</div>
                <button
                    onClick={() => {
                        setExpanded(true)
                    }}
                    className={`${
                        expanded && 'hidden'
                    } ml-2 text-electric-violet-200 sm:hidden`}
                >
                    See more...
                </button>
                <span className={`${!expanded && 'hidden'} sm:inline`}>
                    <FullMarkDown content={gameInfo.rules} />
                </span>
            </div>
            <p className={`${!expanded && 'hidden'} sm:inline`}></p>
        </div>
    )
}
export { About }
