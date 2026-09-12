import type { UserSettingsSchema } from '@source/client'
import type { UserSchema } from '@source/client/models/UserSchema'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { useEffect } from 'react'

import { fetchUser, refreshUserData } from '../../store/user/actions'

const useFetchUser = (): {
    userStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
    user: UserSchema
    settingsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
    refreshUser: () => void
    userSettings: UserSettingsSchema
} => {
    // TODO is it a problem that we are using as... here?  can we use non null assertions?  Should have a better way to handle it
    const user = useAppSelector((state) => state.user.user)
    const userStatus = useAppSelector((state) => state.user.status)
    const userSettings = useAppSelector(
        (state) => state.userSettings.userSettings
    )
    const settingsStatus = useAppSelector((state) => state.userSettings.status)
    const dispatch = useAppDispatch()

    const refreshUser = (): void => {
        void dispatch(refreshUserData('credit'))
    }

    useEffect(() => {
        if (userStatus === 'succeeded') {
            return
        }
        if (userStatus === 'idle') {
            void dispatch(fetchUser())
        }
    }, [userStatus, dispatch])

    useEffect(() => {
        if (settingsStatus === 'succeeded') {
            return
        }
        if (settingsStatus === 'idle') {
            void dispatch(refreshUserData('settings'))
        }
    }, [settingsStatus, dispatch])

    return {
        userStatus,
        user,
        refreshUser,
        settingsStatus,
        userSettings,
    }
}

export { useFetchUser }
