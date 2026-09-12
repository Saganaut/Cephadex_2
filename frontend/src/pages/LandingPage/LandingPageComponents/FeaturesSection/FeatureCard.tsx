import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

interface FeatureCardProps {
  title: string;
  image: string;
  items: string[];
}
const FeatureCard: React.FC<FeatureCardProps> = ({ title, image, items }) => {
  return (
    <div className="min-w-[280px] flex-1 p-4 lg:w-1/3">
      <div className="flex h-full flex-col rounded-[80px]   bg-mariana-blue/60 p-8">
        <div className="mb-3 flex items-center justify-center">
          <img className="h-40" src={image} alt={title} />
        </div>
        <div className="mb-3 flex items-center justify-center">
          <h2 className=" text-lg font-medium text-aquamarine">{title}</h2>
        </div>
        <div className="">
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                className="mb-3 flex justify-start gap-2 text-white "
              >
                <div>
                  <CheckIcon className="h-[24px] rounded-full bg-blaze-orange p-[2px]" />
                </div>
                <div className="text-left">
                  {" "}
                  <p className="flex-1"> {item}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { FeatureCard };
