import React from "react";

interface TestimonialCardProps {
  image: string;
  name: string;
  title: string;
  text: string;
  location: string;
}
const TestimonialCard: React.FC<TestimonialCardProps> = ({
  image,
  name,
  title,
  text,
  location,
}) => {
  return (
    <div className="w-full max-w-[80vw] ">
      <div className="h-full rounded-xl  bg-mariana-blue/70 p-4 text-center ">
        <img
          alt="testimonial"
          className="mb-8 inline-block h-20 rounded-full bg-gray-100  object-cover object-center sm:w-20"
          src={image}
        />

        <h2 className="text-sm font-medium tracking-wider text-white">
          {name}
        </h2>
        <p className="text-gray-500">{title}</p>
        <p className="text-gray-500">{location}</p>
        <span className="mb-4 mt-6 inline-block h-1 rounded bg-electric-violet sm:w-10" />

        <p className="leading-relaxed text-white">{text}</p>
      </div>
    </div>
  );
};

export { TestimonialCard };
