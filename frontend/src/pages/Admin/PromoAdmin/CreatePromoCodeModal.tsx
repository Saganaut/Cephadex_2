import { AdminService, type PromoCodeSchema } from '@source/client'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { ModalWrapper } from '@source/common/Modals/ModalWrapper'
import React from 'react'
import { useForm } from 'react-hook-form'

interface CreatePromoCodeModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreatePromoCodeModal: React.FC<CreatePromoCodeModalProps> = ({
    isOpen,
    setIsOpen,
}) => {
    const { register, handleSubmit } = useForm()
    const onFormSubmit = async (
        data: Partial<PromoCodeSchema>
    ): Promise<void> => {
        const dataStringified = JSON.stringify(data)
        await AdminService.createPromoCode({ data: dataStringified })
    }
    return (
        <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="flex flex-col p-2">
                <h1 className="p-4 text-2xl">Create new promo code</h1>
                <form onSubmit={handleSubmit(onFormSubmit)} className=" p-8 ">
                    <div className="flex justify-between p-2">
                        <label htmlFor="message">type (credits):</label>
                        <input
                            className="text-black"
                            type="text"
                            id="name"
                            {...register('type', {
                                required: 'Type is required',
                            })}
                            placeholder="credits"
                        />
                    </div>
                    <div className="flex justify-between p-2">
                        <label htmlFor="message">Promo type:</label>
                        <input
                            className="text-black"
                            type="text"
                            id="promoType"
                            {...register('promoType')}
                            placeholder="x-mas"
                        />
                    </div>
                    <div className="flex justify-between p-2">
                        <label htmlFor="message">Max uses:</label>
                        <input
                            className="text-black"
                            type="number"
                            id="maxUses"
                            {...register('maxUses')}
                            placeholder="1000"
                        />
                    </div>
                    <div className="flex justify-between p-2">
                        <label htmlFor="message">Credits:</label>
                        <input
                            className="text-black"
                            type="number"
                            id="credits"
                            {...register('credits')}
                            placeholder="500"
                        />
                    </div>
                    <div className="flex justify-between p-2">
                        <label htmlFor="message">Expiration date:</label>
                        <input
                            className="text-black"
                            type="date"
                            id="expirationDate"
                            {...register('expirationDate')}
                        />
                    </div>
                    <StyledButton
                        type="submit"
                        size="small"
                        label="Create code"
                    />
                </form>
            </div>
        </ModalWrapper>
    )
}

export { CreatePromoCodeModal }
