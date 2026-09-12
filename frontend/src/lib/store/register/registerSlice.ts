import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface RegisterState {
    username: string
    firstName: string
    lastName: string
    email: string
    token: string
    picture: string
    externalType: string
    howDidYouHearAboutUs: string
    role: string
    useUsFor: string
    terms: boolean
    newsletter: boolean
    promoCode: string
}

const initialState: RegisterState = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    token: '',
    picture: '',
    externalType: '',
    howDidYouHearAboutUs: '',
    role: '',
    useUsFor: '',
    terms: false,
    newsletter: false,
    promoCode: '',
}

export const registrationSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setFieldValue: (
            state,
            action: PayloadAction<{
                field: keyof RegisterState
                value: RegisterState[keyof RegisterState]
            }>
        ) => {
            const { field, value } = action.payload
            if (field in state) {
                state[field] = value
            }
        },

        resetRegistration: () => initialState,
        setFieldValues: (
            state,
            action: PayloadAction<Partial<RegisterState>>
        ) => {
            const updates = action.payload
            Object.keys(updates).forEach((key) => {
                const field = key as keyof RegisterState
                const value = updates[field]
                if (value !== undefined) {
                    state[field] = value
                }
            })
        },
    },
})

export const { setFieldValue, resetRegistration, setFieldValues } =
    registrationSlice.actions

export default registrationSlice.reducer
