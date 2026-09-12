import type { UserSchema } from '@source/client'
import { Button } from '@source/common/Buttons/Button'
// import type { PlanItem as PlanItemType } from '@source/types/User'
import React from 'react'
import { Link } from 'react-router-dom'

import { PlanItem } from './components/PlanItem'
import { RedeemCodeModal } from './components/RedeemCodeModal'
import { plans } from './data/plans'

interface PlansProps {
    user: UserSchema
}

const Plans: React.FC<PlansProps> = ({ user }) => {
    const [redeemModalIsOpen, setRedeemModalIsOpen] = React.useState(false)
    const userPlanNumber = (user.subscriptionPlan ?? 1) - 1

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const userPlan = plans[userPlanNumber] ?? plans[1]

    return (
        <div className={'mt-[20px] sm:mt-[68px]'}>
            {user.subscriptionPlan === 1 ? (
                <>
                    {/* <h1 className={"text-[24px] font-semibold text-aquamarine"}>
            You can do more with Cephadex
          </h1>
          <div className={"mt-[10px] flex justify-end"}>
            <Link to={"/upgrade"}>
              <Button label={"Start  a free trial"} onClick={() => {}} />
            </Link>
          </div> */}
                </>
            ) : (
                <Link to="https://billing.stripe.com/p/login/dR66pKbnh8vn7qo9AA">
                    <p className="pb-5 text-tolopea underline dark:text-white">
                        {' '}
                        See your payment details
                    </p>
                </Link>
            )}
            <div
                onClick={() => {
                    setRedeemModalIsOpen(!redeemModalIsOpen)
                }}
                className="cursor-pointer text-tolopea underline dark:text-white"
            >
                Have a promo code?
            </div>
            <h1
                className={
                    'pb-[18px] text-[24px] font-semibold text-blaze-orange'
                }
            >
                Current Plan
            </h1>
            <div className={'flex items-center'}>
                {/*   Current Plan */}
                <div className="mb-4">
                    <PlanItem {...userPlan} />
                </div>
                {user.subscriptionPlan === 1 && (
                    <div className="hidden px-10 sm:block">
                        <div
                            className={
                                'flex w-full flex-col items-center text-center '
                            }
                        >
                            <h1
                                className={
                                    'text-[24px] font-semibold text-tolopea dark:text-aquamarine'
                                }
                            >
                                You can do more with Cephadex
                            </h1>
                            <p
                                className={
                                    'max-w-[270px] pt-[10px] text-tolopea dark:text-white'
                                }
                            >
                                Use speed up your decks and quizzes and more.
                            </p>
                            <div className={'mt-[65px]'}>
                                <Link to={'/upgrade'}>
                                    <Button
                                        label={'Start  a free trial'}
                                        onClick={() => {}}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <RedeemCodeModal
                isOpen={redeemModalIsOpen}
                setIsOpen={setRedeemModalIsOpen}
            />
        </div>
    )
}
export { Plans }
