import React, { type ReactElement, useEffect, useState } from 'react'
import { Droppable, type DroppableProps } from 'react-beautiful-dnd'

const StrictModeDroppable = ({
    children,
    ...props
}: DroppableProps): ReactElement | null => {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        const animation = requestAnimationFrame(() => {
            setEnabled(true)
        })

        return () => {
            cancelAnimationFrame(animation)
            setEnabled(false)
        }
    }, [])

    if (!enabled) {
        return null
    }

    return <Droppable {...props}>{children}</Droppable>
}
export { StrictModeDroppable }
