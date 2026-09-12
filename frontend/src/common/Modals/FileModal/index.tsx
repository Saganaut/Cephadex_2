import CephaBannerOne from '@assets/logos/CephaBannerOne.png'
import { PrinterIcon, TrashIcon } from '@heroicons/react/24/outline'
import { DeckService } from '@source/client'
import { IconButton } from '@source/common/Buttons/IconButton'
import { EditButton } from '@source/common/Buttons/IconButtons/EditButton'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import FullMarkDown from '@source/common/FullMarkDown'
import { useFileContext } from '@source/lib/contexts/FileContext'
import {
    deleteOneDeckFile,
    renameOneFile,
} from '@source/lib/store/deckFiles/actions'
import { useAppDispatch } from '@source/lib/store/hooks'
import type { RootState } from '@source/lib/store/store'
import { ErrorMessage } from '@source/pages/Register/ErrorMessage'
import { useAppSelector } from '@store/hooks'
import React, { useEffect, useState } from 'react'
import DocViewer, { MSDocRenderer } from 'react-doc-viewer'
import { useForm } from 'react-hook-form'

import { DeleteConfirmationModal } from '../DeleteConfirmationModal'
import { ModalWrapper } from '../ModalWrapper'
import { usePrintFile } from './usePrintFile'

const FileModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const { fileModalIsOpen, setFileModalIsOpen, file, deckId } =
        useFileContext()
    const [fileName, setFileName] = useState(file?.name ?? '')
    const user = useAppSelector((state: RootState) => state.user.user)
    const [editName, setEditName] = useState(false)
    const [deleteIsOpen, setDeleteIsOpen] = useState(false)
    const handleDeleteFile = (): void => {
        if (file == null) return
        void dispatch(deleteOneDeckFile({ deckId, fileId: file?.id }))
        setFileModalIsOpen(false)
        setDeleteIsOpen(false)
    }
    const freeUser =
        user?.subscriptionPlan != null ? user.subscriptionPlan < 3 : false
    const handlePrintFile = usePrintFile(freeUser, fileName)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    // const handleDownloadFile = async (): Promise<void> => {
    //     if (file == null) return
    //     const response = await DeckService.downloadFileAsPdf(deckId, file?.id)
    //     const blob = new Blob([response], { type: 'application/pdf' })
    //     const url = window.URL.createObjectURL(blob)
    //     const link = document.createElement('a')
    //     link.href = url
    //     link.setAttribute('download', 'downloaded_file.pdf')
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    // }

    // TODO come back and fix this, adding back in the filename dependency.  Removed for now as it causes the old name to apepar after editing the name
    // useEffect(() => {
    //     if (file?.name !== fileName) {
    //         setFileName(file?.name ?? '')
    //     }
    // }, [file?.name, fileName])

    //TODO: potentially unsafe data.filename use
    const onSubmit = (data): void => {
        if (file == null) return
        void dispatch(
            renameOneFile({ deckId, fileId: file?.id, name: data.fileName })
        )
        setFileName(data.fileName)
        setEditName(false)
    }

    const CustomDocHeader = (): React.JSX.Element => {
        return (
            <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
                <div className="flex items-center">
                    <img
                        src={CephaBannerOne}
                        alt="Cepha Banner"
                        className="h-8 "
                    />
                    <h1 className="ml-2 text-xl font-bold text-gray-800">
                        {file?.name ?? ''}
                    </h1>
                </div>
            </div>
        )
    }
    const isSmallScreen = window.innerWidth <= 600 // Adjust the breakpoint as needed
    const style = isSmallScreen
        ? { width: '100%', height: 500 }
        : { width: 500, height: 500 }

    return (
        <>
            <ModalWrapper
                bgColor="dark:bg-mariana-blue bg-electric-violet-200"
                isOpen={fileModalIsOpen}
                setIsOpen={setFileModalIsOpen}
            >
                <div
                    className={
                        'relative mx-auto flex-col  rounded-[24px] text-white sm:min-w-[60vw]'
                    }
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex  items-center justify-center gap-4 p-4 ">
                            {editName ? (
                                <>
                                    <div className="flex  items-center  justify-center">
                                        <input
                                            type="text"
                                            className="rounded-full bg-transparent px-2 text-2xl"
                                            placeholder={fileName ?? ''}
                                            {...register('fileName', {
                                                required: true,
                                                maxLength: {
                                                    value: 100,
                                                    message:
                                                        'Name must be 20 characters or less',
                                                },
                                                minLength: {
                                                    value: 3,
                                                    message:
                                                        'Name must be at least 3 characters long',
                                                },
                                                pattern: {
                                                    value: /^[a-zA-Z0-9_-\s]+$/,
                                                    message:
                                                        'Name can only contain letters, numbers, underscores, and hyphens',
                                                },
                                            })}
                                        />
                                        <ErrorMessage
                                            message={
                                                String(
                                                    errors?.fileName?.message
                                                ) ?? ''
                                            }
                                        />
                                    </div>

                                    <StyledButton
                                        type="submit"
                                        label="Save"
                                        size="small"
                                    />
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl"> {fileName} </h1>{' '}
                                    <EditButton
                                        style="shallows"
                                        onClick={() => {
                                            setEditName(true)
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </form>
                    <div className="flex grow justify-evenly   p-2">
                        {file?.fileType === 'pdf' ||
                        file?.fileType === '.pdf' ? (
                            <div className="max-h-[80vh]">
                                <iframe
                                    src={file.filePath ?? ''}
                                    className="h-[50vh] w-full sm:w-[50vw]"
                                />
                            </div>
                        ) : file?.fileType === 'pptx' ||
                          file?.fileType === '.pptx' ||
                          file?.fileType === 'docx' ||
                          file?.fileType === '.docx' ? (
                            <div className=" border-2">
                                <DocViewer
                                    documents={[
                                        {
                                            uri: file.filePath ?? '',
                                            fileType: file.fileType.replace(
                                                /\./g,
                                                ''
                                            ),
                                        },
                                    ]}
                                    pluginRenderers={[MSDocRenderer]}
                                    config={{
                                        header: {
                                            overrideComponent: CustomDocHeader,
                                        },
                                    }}
                                    style={style}
                                />
                            </div>
                        ) : (
                            <div id="printableArea">
                                {' '}
                                <div className=" max-h-[80vh] min-h-[40vh] min-w-[40vw] overflow-auto rounded-2xl bg-white p-4 text-left text-black dark:bg-mariana-blue-100">
                                    <FullMarkDown
                                        content={
                                            file?.textString ??
                                            'Content unavailable'
                                        }
                                    />
                                </div>
                                {/* <p> {file?.textString}</p> */}
                            </div>
                        )}
                    </div>
                    <div
                        className={'mt-[20px] flex  justify-center gap-2 pb-4'}
                    >
                        <IconButton
                            icon={<TrashIcon />}
                            theme="violet"
                            ariaLabel=""
                            to=""
                            collapse
                            onClick={() => {
                                setDeleteIsOpen(true)
                            }}
                        />
                        {/* <IconButton
              icon={<ArrowDownTrayIcon />}
              theme="violet"
              ariaLabel=""
              to=""
              collapse
              onClick={handleDownloadFile}
            /> */}
                        {file?.fileType === 'pdf' ||
                        file?.fileType === '.pdf' ||
                        file?.fileType === 'pptx' ||
                        file?.fileType === '.pptx' ||
                        file?.fileType === 'docx' ||
                        file?.fileType === '.docx' ? (
                            ''
                        ) : (
                            <IconButton
                                icon={<PrinterIcon />}
                                theme="violet"
                                ariaLabel=""
                                to=""
                                collapse
                                onClick={handlePrintFile}
                            />
                        )}
                    </div>
                </div>
            </ModalWrapper>
            <DeleteConfirmationModal
                isOpen={deleteIsOpen}
                setIsOpen={setDeleteIsOpen}
                handleDelete={handleDeleteFile}
                title={'Delete file'}
                message={'Are you sure you want to delete this file?'}
            />
        </>
    )
}

export { FileModal }

// const handlePrintFile = (): void => {
//     const printableArea = document.getElementById("printableArea").innerHTML;
//     if (printableArea === null) return;
//     const printWindow = window.open("", "_blank");
//     if (printWindow === null) return;
//     printWindow.document.write(`
//     <html>
//     <head>
//         <title>${freeUser ? "www.cephadex.com" : fileName}</title>
//         ${
//           freeUser
//             ? `<img src="${CephaBannerOne}" style=" height: 50px;" />`
//             : ""
//         }
//         <style>
//             @media print {
//                 @page {
//                     margin: 2cm;
//                 }
//                 img {
//                     display: block; /* Make sure to display the image only in print if needed */
//                 }
//             }
//         </style>
//     </head>
//     <body>
//         ${printableArea}
//     </body>
// </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();

//     printWindow.onload = function () {
//       printWindow.print();
//       printWindow.close();
//     };
//   };
