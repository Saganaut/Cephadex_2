import React from 'react'

interface UserPlaceItemProps {
    index: number
    points: number
    icon: React.ReactElement
}

const UserPlaceItem: React.FC<UserPlaceItemProps> = ({
    index,
    points,
    icon,
}) => {
    return (
        <div
            key={index}
            className={
                'flex h-8 w-16 items-center gap-2 rounded-full bg-tolopea px-1'
            }
        >
            {icon}
            <div className="text-sm font-medium text-aquamarine">{points}</div>
        </div>
    )
}

export { UserPlaceItem }
