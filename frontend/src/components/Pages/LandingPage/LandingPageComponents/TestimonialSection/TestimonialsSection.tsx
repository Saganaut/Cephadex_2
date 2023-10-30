import React from "react";
import { TestimonialCard } from "@pages/LandingPage/LandingPageComponents/TestimonialSection/TestimonialCard";

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

const TestimonialsSection = () => {
  return (
    <>
      {/* Hello world */}
      <section className="body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex justify-center">
            <h1 className="text-4xl font-bold text-center text-electric-violet p-5">
              Hear what our users have to say
            </h1>
          </div>
          <div className="flex flex-wrap m-4">
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
