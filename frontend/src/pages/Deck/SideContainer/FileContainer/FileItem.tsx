import DocxIcon from '@assets/fileTypes/DocxIcon.svg?react'
import PdfIcon from '@assets/fileTypes/PdfIcon.svg?react'
import PptxIcon from '@assets/fileTypes/PptxIcon.svg?react'
import DefinitionCardIcon from '@source/assets/cardTypeIcons/DefinitionCardIcon.svg?react'
import { truncate } from '@source/lib/utils/functions'
import React from 'react'

interface FileItemProps {
    file: any
    type: string
}
const FileItem: React.FC<FileItemProps> = ({ file, type }) => {
    return (
        <>
            <div className="flex max-w-[200px] rounded-full p-1 sm:max-w-[400px]">
                {file.fileType === 'pdf' ? (
                    <PdfIcon className="size-6" />
                ) : file.fileType === 'pptx' ? (
                    <PptxIcon className="size-6" />
                ) : file.fileType === 'docx' ? (
                    <DocxIcon className="size-6" />
                ) : (
                    <DefinitionCardIcon className="size-6" />
                )}
                <div className=" cursor-pointer overflow-hidden pl-2 text-xs hover:text-blaze-orange  sm:text-base">
                    {truncate(file.name, 30)}
                </div>{' '}
                <div>{file.type}</div>
            </div>
        </>
    )
}

export { FileItem }
