import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { SectionHeading } from "../../SectionHeading";
import { TestimonialCard } from "./TestimonialCard";
import { Testimonials } from "./TestimonialData";

const TestimonialsSection: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [currentTestimonial, setCurrentTestimonial] = useState(Testimonials[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const carousel = carouselRef.current;
    const scrollWidth = carousel?.scrollWidth ?? 0;
    const clientWidth = carousel?.clientWidth ?? 0;

    const autoScroll = async (): Promise<void> => {
      await controls.start({
        x: -(scrollWidth - clientWidth),
        transition: { duration: 30, ease: "linear" },
      });
      carousel?.scrollTo({ left: 0, behavior: "smooth" });
      await controls.start({ x: 0, transition: { duration: 0 } });

      requestAnimationFrame(autoScroll); // Use requestAnimationFrame for better control
    };

    void autoScroll();

    return () => {
      controls.stop();
    };
  }, [controls, isMobile]);

  const switchTestimonial = (direction: "left" | "right"): void => {
    if (currentTestimonial === undefined) return;
    const currentIndex = Testimonials.indexOf(currentTestimonial);

    switch (direction) {
      case "left":
        if (currentIndex === 0) {
          setCurrentTestimonial(Testimonials[Testimonials.length - 1]);
        } else {
          setCurrentTestimonial(Testimonials[currentIndex - 1]);
        }
        break;

      case "right":
        if (currentIndex === Testimonials.length - 1) {
          setCurrentTestimonial(Testimonials[0]);
        } else {
          setCurrentTestimonial(Testimonials[currentIndex + 1]);
        }
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <SectionHeading
        title="What do our users say?"
        message="Amazing things!"
      />
      <div className="flex justify-center">
        <div className="relative hidden overflow-hidden rounded-xl px-2 md:block md:max-w-[80vw]">
          <motion.div
            ref={carouselRef}
            className="flex flex-row sm:space-x-2 md:space-x-4"
            animate={controls}
          >
            {Testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-full flex-none rounded-lg  shadow-lg sm:w-1/2 md:w-1/3"
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-0 flex">
            <div className="w-20  bg-gradient-to-r from-tolopea/70 to-transparent"></div>{" "}
            <div className="flex-1"></div>
            <div className="w-20  bg-gradient-to-l from-tolopea/70 to-transparent"></div>
          </div>{" "}
        </div>
        <div className="md:hidden">
          <div className="flex flex-row items-center  ">
            <ArrowLeftCircleIcon
              className="h-10 cursor-pointer p-1 text-aquamarine-100"
              onClick={() => {
                switchTestimonial("left");
              }}
            />
            <div className="flex-none rounded-lg shadow-lg transition-all duration-500 ease-in-out ">
              {currentTestimonial != null && (
                <TestimonialCard {...currentTestimonial} />
              )}
            </div>
            <ArrowRightCircleIcon
              className="h-10 cursor-pointer p-1 text-aquamarine-100"
              onClick={() => {
                switchTestimonial("right");
              }}
            />
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export { TestimonialsSection };
