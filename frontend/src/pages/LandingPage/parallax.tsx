import layer_0 from "@source/assets/landingPage/layer_0.svg";
import layer_1 from "@source/assets/landingPage/layer_1.svg";
import layer_3 from "@source/assets/landingPage/layer_3.svg";
import layer_4 from "@source/assets/landingPage/layer_4.svg";
import layer_5 from "@source/assets/landingPage/layer_5.svg";
import layer_6 from "@source/assets/landingPage/layer_6.svg";
import layer_7 from "@source/assets/landingPage/layer_7.svg";
import layer_8 from "@source/assets/landingPage/layer_8.svg";
import layer_9 from "@source/assets/landingPage/layer_9.svg";
import layer_10 from "@source/assets/landingPage/layer_10.svg";
import layer_11 from "@source/assets/landingPage/layer_11.svg";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { useModal } from "@source/lib/contexts/ModalContext";
import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

import Pricing from "../Pricing";
import { FeaturesSection } from "./LandingPageComponents/FeaturesSection/FeaturesSection";
import { HowItWorksSection } from "./LandingPageComponents/HowItWorksSection/HowItWorksSection";
import { PricingSection } from "./LandingPageComponents/PricingSection/PricingSection";
import { TestimonialsSection } from "./LandingPageComponents/TestimonialSection/TestimonialsSection";

const ls = [
  // clouds
  {
    speed: 0,
    imageSrc: layer_0,
    startOffset: -200,
    zIndex: 2,
    height: "600vh",
  },
  // sky
  {
    speed: -200,
    imageSrc: layer_1,
    startOffset: -200,
    zIndex: 1,
    height: "600vh",
  },
  // waves
  {
    speed: -400,
    imageSrc: layer_3,
    startOffset: -400,
    zIndex: 4,
    height: "600vh",
  },
  // shallow fish
  {
    speed: -800,
    imageSrc: layer_4,
    startOffset: -400,
    zIndex: 10,
    height: "600vh",
  },
  // first seabed
  {
    speed: -600,
    imageSrc: layer_5,
    startOffset: -600,
    zIndex: 6,
    height: "600vh",
  },
  // middle fish
  {
    speed: -400,
    imageSrc: layer_6,
    startOffset: -1200,
    zIndex: 7,
    height: "600vh",
  },
  // second seabed
  {
    speed: -200,
    imageSrc: layer_7,
    startOffset: -1400,
    zIndex: 8,
    height: "600vh",
  },
  // fish with book
  {
    speed: -100,
    imageSrc: layer_8,
    startOffset: -2000,
    zIndex: 9,
    height: "600vh",
  },
  // third seabed
  {
    speed: -100,
    imageSrc: layer_9,
    startOffset: -2000,
    zIndex: 11,
    height: "600vh",
  },
  // manta ray
  {
    speed: -100,
    imageSrc: layer_10,
    startOffset: -2500,
    zIndex: 12,
    height: "600vh",
  },
  // sea floor
  {
    speed: -100,
    imageSrc: layer_11,
    startOffset: -2400,
    zIndex: 13,
    height: "700vh",
  },
];
interface ParallaxlProps {
  speed: number;
  imageSrc: string;
  startOffset?: number;
  z?: number;
  height?: string;
  bordColor?: string;
}

const Parallax: React.FC<ParallaxlProps> = ({
  speed,
  imageSrc,
  startOffset = 200,
  z = 1,
  height = "200vh",
  bordColor,
}) => {
  const { scrollY } = useScroll();

  const effectiveScrollY = useTransform(scrollY, (value) =>
    Math.max(0, value - startOffset)
  );
  const y = useTransform(effectiveScrollY, [0, 1000], [0, speed]);
  return (
    <motion.div
      style={{
        y,
        background: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: `${startOffset}px`,
        left: 0,
        width: "100vw",
        height: `${height}`,
        zIndex: `${z}`,
        // border: `2px solid red`,
        // borderColor: `${bordColor}`,
      }}
    />
  );
};

const LandingPage: React.FC = () => {
  const { openSignInModal } = useModal();

  const maxStartOffset = Math.max(...ls.map((l) => l.startOffset));
  // const containerHeight = `calc(5000px + ${maxStartOffset}px) `;
  const containerHeight = "600vh";
  return (
    <div
      className="relative z-[30]  bg-tolopea"
      style={{ height: containerHeight }}
    >
      <div className="h-full  ">
        {`Hero section`}
        <section className="relative z-[30] mt-[-150px] flex h-screen flex-col items-center justify-center text-center">
          <div className="relative  z-[30] flex text-[120px] font-bold  text-blaze-orange">
            {" "}
            Cephadex
          </div>
          <div className="relative  z-[30] flex text-xl ">
            <p className="font-semibold text-tolopea">
              Are you ready to dive in?
            </p>
          </div>
          <div>
            {/* <div className=" "> */}
            <div className=" flex justify-between gap-2 pt-8">
              <StyledButton
                onClick={() => {
                  openSignInModal("register");
                }}
                style="depths"
                size="medium"
                label="Sign up for free"
                disabled={false}
              />
              <StyledButton
                onClick={() => {}}
                style="default"
                size="medium"
                label="Dive in"
                disabled={false}
              />{" "}
            </div>
          </div>
        </section>
        {``}
        <section className="relative z-[30] flex  h-screen items-center justify-center border-2 border-red-500 text-center">
          <FeaturesSection />
        </section>
        <section className="relative z-[30] flex h-[80vh] items-center justify-center border-2 border-red-500 text-center">
          {" "}
          <HowItWorksSection />
        </section>
        <section className="relative z-[30] flex  h-[80vh] items-center justify-center border-2 border-red-500 text-center">
          {" "}
          <TestimonialsSection />
        </section>
        <section className="relative z-[30] flex  h-[80vh] items-center justify-center border-2 border-red-500 p-2 text-center">
          <PricingSection />
        </section>
      </div>
      <>
        {ls.map((l, index) => (
          <Parallax
            key={index}
            speed={l.speed}
            imageSrc={l.imageSrc}
            startOffset={l.startOffset}
            z={l.zIndex}
            height={l.height}
          />
        ))}
      </>
    </div>
  );
};

export { Parallax };
