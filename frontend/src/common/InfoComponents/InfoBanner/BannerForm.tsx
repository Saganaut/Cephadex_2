import { AdminService, type InfoBannerSchema } from '@source/client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const BannerForm = ({ onSubmit }) => {
    const { register, handleSubmit, reset } = useForm()
    const [banners, setBanners] = useState<InfoBannerSchema[]>([])
    const [selectedBanner, setSelectedBanner] =
        useState<Partial<InfoBannerSchema> | null>(null)

    useEffect(() => {
        void fetchBanners()
    }, [])

    const fetchBanners = async (): Promise<void> => {
        try {
            const response = await AdminService.retreiveAllBanners()
            setBanners(response.banner)
        } catch (error) {}
    }

    const onFormSubmit = async (
        data: Partial<InfoBannerSchema>
    ): Promise<void> => {
        try {
            // stringify data
            const dataStringified = JSON.stringify(data)
            if (selectedBanner?.id != null) {
                await AdminService.updateBanner(selectedBanner.id, {
                    data: dataStringified,
                })
            } else {
                await AdminService.createBanner({ data: dataStringified })
            }
            onSubmit()
        } catch (error) {}
    }

    const handleBannerChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const bannerId = event.target.value
        const banner = banners.find(
            (banner) => banner.id === parseInt(bannerId)
        )
        if (banner == null) {
            setSelectedBanner(null)
            return
        }
        setSelectedBanner(banner)
        reset(banner)
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <div>
                <label htmlFor="banner">Select Banner:</label>
                <select id="banner" onChange={handleBannerChange}>
                    <option value="">Create New Banner</option>
                    {banners.map((banner) => (
                        <option key={banner.id} value={banner.id}>
                            {banner.message}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="message">Message:</label>
                <input
                    type="text"
                    id="message"
                    {...register('message', {
                        required: 'Message is required',
                    })}
                />
            </div>
            <div>
                <label htmlFor="messageType">Message Type:</label>
                <select
                    id="messageType"
                    {...register('messageType', {
                        required: 'Message Type is required',
                    })}
                >
                    <option value="">Select a type</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="news">News</option>
                </select>
            </div>
            {/* <div>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="datetime-local"
          id="endDate"
          {...register("endDate", { required: "End Date is required" })}
        />
      </div> */}
            <div>
                <label htmlFor="active">Active:</label>
                <input type="checkbox" id="active" {...register('active')} />
            </div>
            <button type="submit">
                {selectedBanner ? 'Update Banner' : 'Create Banner'}
            </button>
        </form>
    )
}

export default BannerForm
