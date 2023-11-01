import React from "react";

interface TestimonialCardProps {
  image: string;
  name: string;
  title: string;
  text: string;
}
const TestimonialCard: React.FC<TestimonialCardProps> = ({
  image,
  name,
  title,
  text,
}) => {
  return (
    <div className="p-4 lg:mb-0 lg:w-1/3">
      <div className="h-full rounded-xl border bg-mariana-blue p-4 text-center">
        <img
          alt="testimonial"
          className="mb-8 inline-block h-20 w-20 rounded-full border-2 border-gray-200 bg-gray-100 object-cover object-center"
          src={image}
        />

        <h2 className="title-font text-sm font-medium tracking-wider text-white">
          {name}
        </h2>
        <p className="text-gray-500">{title}</p>

        <span className="mb-4 mt-6 inline-block h-1 w-10 rounded bg-electric-violet" />

        <p className="leading-relaxed text-white">{text}</p>
      </div>
    </div>
  );
};

export { TestimonialCard };
