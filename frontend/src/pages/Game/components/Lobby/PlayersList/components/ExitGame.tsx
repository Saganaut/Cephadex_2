import React from 'react'
import { ImExit } from 'react-icons/im'
import { useNavigate } from 'react-router-dom'

interface ExitGameProps {
    handleQuitGame?: () => void
}

const ExitGame: React.FC<ExitGameProps> = ({ handleQuitGame }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => {
                if (handleQuitGame != null) {
                    handleQuitGame()
                    navigate('/')
                }
            }}
            className={
                'flex w-full cursor-pointer items-center gap-x-[8px] rounded-full bg-tolopea px-[12px] py-2 hover:bg-tolopea/50 lg:w-auto'
            }
        >
            <ImExit className={'size-[12px] text-white'} />
            <p className={'text-xs font-medium'}>Exit game</p>
        </div>
    )
}

export { ExitGame }
