import { AdminService } from '@source/client'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { ModalWrapper } from '@source/common/Modals/ModalWrapper'
import { ErrorMessage } from '@source/pages/Register/ErrorMessage'
import React from 'react'
import { useForm } from 'react-hook-form'

interface RedeemCodeModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RedeemCodeModal: React.FC<RedeemCodeModalProps> = ({
    isOpen,
    setIsOpen,
}) => {
    const [modalState, setModalState] = React.useState('idle') // idle, success, error
    const [errorMessage, setErrorMessage] = React.useState('')
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    //TODO: to fix this just need to register the form field before the function + add error message
    const onFormSubmit = async (data: object): Promise<void> => {
        if (data.promoCode) {
            const response = await AdminService.redeemPromoCode(data.promoCode)
            if (response.status === 'success') setModalState('success')
            if (response.status === 'error') {
                setModalState('error')
                setErrorMessage(response.message)
            }
        }
    }

    return (
        <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="flex min-h-[100px] min-w-[200px] px-4 py-8">
                {modalState === 'idle' && (
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className=" p-8 "
                    >
                        <h1 className="pb-2 text-xl">
                            Enter your 6 character code below:
                        </h1>
                        <div className="flex justify-between gap-1 p-2">
                            <label htmlFor="message">Promo code:</label>
                            <input
                                className="max-w-[100px] rounded-xl px-2 text-black"
                                type="text"
                                id="promoCode"
                                {...register('promoCode', {
                                    maxLength: {
                                        value: 6,
                                        message:
                                            'codes should be 6 characters long',
                                    },
                                    minLength: {
                                        value: 6,
                                        message:
                                            'Codes should be 6 characters long',
                                    },
                                    required: 'You must include a promo code',
                                })}
                            />
                        </div>{' '}
                        <div className="min-h-[30px]">
                            <ErrorMessage
                                message={
                                    typeof errors?.promoCode?.message ===
                                    'string'
                                        ? errors.promoCode.message
                                        : undefined
                                }
                            />
                        </div>
                        <StyledButton
                            size="small"
                            type="submit"
                            label={'Redeem code'}
                            onClick={() => {
                                setModalState('idle')
                            }}
                        />
                    </form>
                )}
                {modalState === 'success' && (
                    <>
                        <div className="flex-col">
                            <h2 className="py-4 text-2xl">
                                {' '}
                                Code redeemed succesfully!
                            </h2>
                            <p>
                                {' '}
                                It can take a couple minutes to work through our
                                system but your code should now be active
                            </p>
                        </div>
                        <StyledButton
                            label={'Add another code'}
                            onClick={() => {
                                setModalState('idle')
                            }}
                        />
                    </>
                )}
                {modalState === 'error' && (
                    <>
                        <div className="flex-col">
                            <h2 className="py-4 text-2xl">
                                {' '}
                                We encountered an error!
                            </h2>
                            <p>{errorMessage}</p>{' '}
                            <div className="pt-4">
                                <StyledButton
                                    size="small"
                                    label={'Add another code'}
                                    onClick={() => {
                                        setModalState('idle')
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </ModalWrapper>
    )
}

export { RedeemCodeModal }
