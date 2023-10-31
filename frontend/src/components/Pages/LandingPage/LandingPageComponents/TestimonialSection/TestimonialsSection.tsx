import { TestimonialCard } from "@pages/LandingPage/LandingPageComponents/TestimonialSection/TestimonialCard";
import React, { type ReactElement } from "react";

const Testimnonials = [
  {
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYW",
    title: "Teacher",
  },
  {
    name: "Jane Smith",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYW",
    title: "Student",
  },
  {
    name: "Albert Einstein",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYW",
    title: "Influencer",
  },
];

const TestimonialsSection = (): ReactElement => {
  return (
    <>
      {/* Hello world */}
      <section className="body-font">
        <div className="container mx-auto px-5 py-24">
          <div className="flex justify-center">
            <h1 className="p-5 text-center text-4xl font-bold text-electric-violet">
              Hear what our users have to say
            </h1>
          </div>
          <div className="m-4 flex flex-wrap">
            <TestimonialCard {...Testimnonials[0]} />
            <TestimonialCard {...Testimnonials[1]} />
            <TestimonialCard {...Testimnonials[2]} />
          </div>
        </div>
      </section>
    </>
  );
};

export { TestimonialsSection };
