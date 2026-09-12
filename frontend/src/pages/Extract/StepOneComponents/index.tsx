import React, { type ReactElement } from 'react'

import { LeftSide } from './LeftSide/LeftSide'
import { RightSide } from './RightSide/RightSide'

interface ExtractStepOneProps {
    setCreditCost: (creditCost: number) => void
    setCreditLoading: (loading: boolean) => void
    creditCost: number
}

const ExtractStepOne: React.FC<ExtractStepOneProps> = ({
    setCreditCost,
    setCreditLoading,
    creditCost,
}): ReactElement => {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="flex-1 ">
                <LeftSide
                    setCreditCost={setCreditCost}
                    setCreditLoading={setCreditLoading}
                    creditCost={creditCost}
                />
            </div>
            <div className="flex-1 ">
                <RightSide />
            </div>
        </div>
    )
}

export { ExtractStepOne }
