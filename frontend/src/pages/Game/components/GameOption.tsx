import React from 'react'
import { useNavigate } from 'react-router-dom'
interface GameOptionProps {
    gameName: string
    description: string
    gameRef: string
    imgAvatar: React.ReactNode
}

const GameOption: React.FC<GameOptionProps> = ({
    gameName,
    description,
    gameRef,
    imgAvatar,
}) => {
    const navigate = useNavigate()

    return (
        <div
            className="  w-full grow cursor-pointer rounded-xl bg-aquamarine-100 p-4 dark:bg-mariana-blue hover:dark:bg-mariana-blue-100 sm:w-auto"
            onClick={() => {
                navigate(`${gameRef}`)
            }}
        >
            <div className="flex items-center justify-between">
                <h1 className="p-2 text-4xl">{gameName}</h1>
                {imgAvatar}
            </div>
            <p className="max-w-[400px] text-wrap">{description}</p>
        </div>
    )
}

export { GameOption }
