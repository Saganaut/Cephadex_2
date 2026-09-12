import Chatbot from '@assets/Chatbot.svg'
import React, { type ReactElement } from 'react'

const RevealAnswer = (): ReactElement => {
    return (
        <div
            className={
                'h-full w-1/2 rounded-[12px] border-2 border-mariana-blue px-[14px] py-[10px] '
            }
        >
            {/* User Avatar */}
            <div className={'flex items-center gap-x-[8px]'}>
                <img src={Chatbot} alt={'chatbot'} />
                <h1
                    className={
                        'rounded-full bg-blaze-orange-100 px-4 py-[4px] text-sm font-medium text-tolopea'
                    }
                >
                    Teacher Tentacles
                </h1>
            </div>
            {/* this should be removed */}
            <p className={'pl-[44px] leading-[30px]'}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Accusantium commodi cum, in nihil nisi quisquam vel! Error,
                impedit sequi. Adipisci amet aspernatur autem enim et incidunt
                iure nisi nulla omnis, possimus qui quo recusandae, reiciendis
                repellendus repudiandae tempora totam voluptas voluptate! Cum
                ducimus explicabo id impedit placeat qui tenetur vel?
            </p>
        </div>
    )
}
export { RevealAnswer }
