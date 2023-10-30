import React from 'react';
import {SignUpButton, HowItWorksButton} from 'components/Common/Button'
import { useModal } from 'contexts/ModalContext.js';

const IntroVideo = () => {
    return <div>

        <div className="rounded-xl overflow-hidden">
            <video className ="h-80 w-auto" controls>
            <source src="/assets/cephadex-intro-vid.mp4" type="video/mp4" />
            </video>
        </div>
        <div className = "flex flex-row  px-2">
            <div className = "basis-1/2">
                <h2 className = "text-gray-400 text-xs">
                So many options!
                </h2>
            </div>
            <div className = "basis-1/2">
                <h2 className = "text-gray-400 text-xs">
                    Over 60 000 cards created.
                </h2>
            </div>
        </div>
    </div>
    }


const CallToAction = () => {
    const { openRegisterModal } = useModal();

    return <div>

            <h1 className="hero-title text-white">
                Your Personalized <br /> Education Solution
            </h1>
            <div className="text-white">
                <p>Whether you're a teacher, student, content creator, or parent, Cephadex is your platform for customized, effective learning. Join us and experience our innovative approach to education.</p>
            </div>
            <div className = "p-3">
                <SignUpButton onClick={() => { openRegisterModal(); }} label='Try it free today!'></SignUpButton>
                <HowItWorksButton label='How it works?'></HowItWorksButton>
            </div>
        </div>

};

export { CallToAction }
export { IntroVideo }