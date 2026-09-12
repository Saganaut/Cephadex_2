import PlayerAvatar3 from '@assets/PlayerAvatar3.svg?react'
// import { DevTool } from "@hookform/devtools";
import { UserService } from '@source/client'
import { InputField } from '@source/common/Form/InputField'
// import { GoogleLoginButton } from "@source/common/Modals/SignInModal/GoogleLogin/GoogleLoginButton";
import { PageWrapper } from '@source/common/PageWrapper'
import { useModal } from '@source/lib/contexts/ModalContext'
import { useDebouncedEffect } from '@source/lib/hooks/useDebouncedEffect'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { setUser } from '@source/lib/store/user/userSlice'
import { checkUsername } from '@source/lib/utils/functions'
import { ErrorMessage } from '@source/pages/Register/ErrorMessage'
import React, { type FC, useEffect } from 'react'
import {
    type SubmitErrorHandler,
    type SubmitHandler,
    useForm,
} from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

// Join is only used for non logged in users, otherwise go straight to InGame
const Join: FC = () => {
    const { rawGameId } = useParams()
    const { openSignInModal } = useModal()
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    const registerState = useAppSelector((state) => state.registration)
    const user = useAppSelector((state) => state.user.user)
    useEffect(() => {
        if (user != null) {
            navigate(`/game/flex/${rawGameId}`)
        }
    }, [user, rawGameId, navigate])

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        trigger,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            mode: 'onChange',
            reValidateMode: 'onChange',
            shouldFocusError: true,
            username: registerState.username ?? '',
            role: { value: undefined, label: registerState.role ?? '' },
        },
    })

    const usernameField = register('username', {
        required: 'Please choose a username',
        maxLength: {
            value: 15,
            message: 'Username must be 15 characters or less',
        },
        minLength: {
            value: 3,
            message: 'Username must be at least 3 characters long',
        },
        pattern: {
            value: /^[a-zA-Z0-9_-]+$/,
            message:
                'Username can only contain letters, numbers, underscores, and hyphens',
        },
    })

    const username = watch('username')
    const onSubmit: SubmitHandler<any> = async (data) => {
        dispatch(setUser({ username: data.username, guest: true }))
        await UserService.createGuestAccount({ username })
        // const { user } = await UserService.getUser();
        // if (user != null) {
        //   dispatch(
        //     addPlayer({
        //       id: user.id ?? 0,
        //       points_answer: 0,
        //       points_deceiver: 0,
        //       username: user?.username ?? "",
        //       color: getRandomItem(bgColors) ?? "bg-electric-violet",
        //       isHost: false,
        //       isOnline: true,
        //       isPlayer: true,
        //     })
        //   );
        // }
        await UserService.checkUserStatus()

        navigate(`/game/flex/${rawGameId}`)
    }

    const onErrors: SubmitErrorHandler<any> = (errors) => {}

    const submitForm = async (): Promise<void> => {
        const isValid = await trigger() // Trigger validation for all fields

        if (isValid) {
            void handleSubmit(async (data) => {
                const isAvailable = await checkUsername(username)

                if (!isAvailable) {
                    setError('username', {
                        type: 'manual',
                        message: 'Username is already taken',
                    })
                } else {
                    clearErrors('username')
                    onSubmit(data)
                }
            }, onErrors)()
        }
    }

    useDebouncedEffect(
        () => {
            if (username != null && username.length >= 3) {
                void checkUsername(username).then((isAvailable) => {
                    if (!isAvailable) {
                        setError('username', {
                            type: 'manual',
                            message: 'Username is already taken',
                        })
                    } else {
                        clearErrors('username')
                    }
                })
            }
        },
        [username],
        500
    )

    return (
        <PageWrapper>
            <>
                <div className="mx-auto mb-8 w-[90vw] rounded-2xl bg-mariana-blue text-white">
                    <div className="mx-3 flex max-w-lg flex-col sm:mx-auto">
                        <div className="mx-auto mb-4 mt-10 text-lg font-semibold sm:mt-28">
                            Continue as a guest
                        </div>
                        <div className="flex items-center justify-start gap-2 rounded-full border-2 border-white">
                            <div>
                                <PlayerAvatar3 className="mx-[6px] my-1 size-9" />
                            </div>
                            <InputField
                                className={`w-full border-0 bg-transparent  placeholder:text-aquamarine  ${
                                    username.length !== 0
                                        ? 'font-semibold'
                                        : 'text-xs text-opacity-30'
                                } rounded-full px-2`}
                                name={usernameField.name}
                                onChange={usernameField.onChange}
                                onBlur={usernameField.onBlur}
                                inputFieldRef={usernameField.ref}
                                placeholder="Enter a title no longer than 15 characters"
                                type="text"
                                value={getValues('username')}
                            />
                        </div>
                        <ErrorMessage message={errors?.username?.message} />

                        <div className="my-8 flex items-center">
                            <div className="h-px w-full bg-white" />
                            <div className="mx-6 text-xl">or</div>
                            <div className="h-px w-full bg-white" />
                        </div>

                        <div className="mb-9 flex w-full justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    openSignInModal('login')
                                }}
                                className="w-full  rounded-full bg-blaze-orange px-9 py-1 text-lg font-semibold text-aquamarine"
                            >
                                login
                            </button>
                        </div>

                        <div className="mb-14 hidden w-full justify-center sm:flex">
                            <button
                                type="submit"
                                onClick={submitForm}
                                disabled={
                                    !(
                                        errors?.username?.message?.length ==
                                        null
                                    ) || username.length === 0
                                }
                                className="rounded-full bg-blaze-orange px-9 py-1 text-lg font-medium text-white disabled:bg-mariana-blue-100 disabled:text-opacity-50"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex w-full justify-center sm:hidden">
                    <button
                        type="submit"
                        onClick={submitForm}
                        disabled={
                            !(errors?.username?.message?.length == null) ||
                            username.length === 0
                        }
                        className="rounded-full bg-blaze-orange px-9 py-1 text-lg font-medium text-white disabled:bg-mariana-blue-100 disabled:text-opacity-50"
                    >
                        Join
                    </button>
                </div>
                {/* <DevTool control={control} /> */}
            </>
        </PageWrapper>
    )
}

export default Join
