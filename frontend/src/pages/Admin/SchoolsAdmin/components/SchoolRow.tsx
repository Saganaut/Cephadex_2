import type { SchoolSchema } from '@source/client'
import React from 'react'

import { CodesModal } from './CodesModal'

interface SchoolRowProps {
    school: SchoolSchema
}

const SchoolRow: React.FC<SchoolRowProps> = ({ school }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div key={school.id}>
            <h2>School: {school.name} </h2>
            <div className="flex gap-2">
                <p>Country: {school.country} </p>
                <p>Email: {school.email} </p>
                <p>Contact: {school.mainContact}</p>
                <p
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                >
                    codes
                </p>
            </div>

            <CodesModal school={school} setIsOpen={setIsOpen} isOpen={isOpen} />
        </div>
    )
}

export { SchoolRow }
