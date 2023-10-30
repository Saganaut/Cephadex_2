import React from 'react';
import { CallToAction, IntroVideo } from './CallToAction';



const HeroSection = () => {
    return (
        <div style={{ height: 'auto', minHeight: 'calc(100vh - 120px)' }} className="bg-electric-violet p-10">
            <div className="flex flex-col-reverse lg:flex-row h-full">
                <div className="flex justify-center items-center w-full h-auto lg:h-1/2 p-5">
                    <IntroVideo />
                </div>
                <div className="p-5 w-full h-auto lg:h-1/2 flex justify-center items-center">
                    <CallToAction />
                </div>
            </div>
        </div>
    );
};

export { HeroSection }