import { AdminService, type SchoolSchema } from '@source/client'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { ModalWrapper } from '@source/common/Modals/ModalWrapper'
import React from 'react'
import { useForm } from 'react-hook-form'

import { countries } from '../data/countryList'
interface CreateSchoolModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateSchoolModal: React.FC<CreateSchoolModalProps> = ({
    isOpen,
    setIsOpen,
}) => {
    const { register, handleSubmit } = useForm()
    const onFormSubmit = async (data: Partial<SchoolSchema>): Promise<void> => {
        const dataStringified = JSON.stringify(data)

        await AdminService.createSchool({ data: dataStringified })
    }

    return (
        <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <form onSubmit={handleSubmit(onFormSubmit)} className=" p-8 ">
                <div className="flex justify-between p-2">
                    <label htmlFor="message">School Name:</label>
                    <input
                        className="text-black"
                        type="text"
                        id="name"
                        {...register('name', {
                            required: 'School name is required',
                        })}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">Contact person:</label>
                    <input
                        className="text-black"
                        type="text"
                        id="mainContact"
                        {...register('mainContact', {
                            required: 'A contact person is required',
                        })}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">Email:</label>
                    <input
                        className="text-black"
                        type="email"
                        id="email"
                        {...register('email', {
                            required: 'An email address is required',
                        })}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="country">Select Country:</label>
                    <select
                        className="max-w-[150px] text-black"
                        id="country"
                        {...register('country', { required: true })}
                    >
                        {countries.map((country, index) => (
                            <option key={index} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">Phone:</label>
                    <input
                        className="text-black"
                        type="text"
                        id="phone"
                        {...register('phone', {
                            required: 'Phone number required',
                        })}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">Address:</label>
                    <input
                        className="text-black"
                        type="text"
                        id="address"
                        {...register('address')}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">City:</label>
                    <input
                        className="text-black"
                        type="text"
                        id="city"
                        {...register('city')}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">Postal code:</label>
                    <input
                        className="text-black"
                        type="text"
                        id="postalCode"
                        {...register('postalCode')}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">Website:</label>
                    <input
                        className="text-black"
                        type="url"
                        id="website"
                        {...register('website')}
                    />
                </div>
                <div className="flex justify-between p-2">
                    <label htmlFor="message">Stripe id:</label>
                    <input
                        className="text-black"
                        type="text"
                        id="stripeId"
                        {...register('stripeId')}
                    />
                </div>

                <StyledButton
                    type="submit"
                    size="small"
                    label="Create school"
                />
            </form>
        </ModalWrapper>
    )
}

export { CreateSchoolModal }
