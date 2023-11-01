import React from "react";

interface FeatureCardProps {
  title: string;
  image: string;
  items: string[];
}
const FeatureCard: React.FC<FeatureCardProps> = ({ title, image, items }) => {
  return (
    <div className="p-4 md:w-1/3">
      <div className="flex h-full flex-col rounded-lg border border-aquamarine bg-mariana-blue p-8">
        <div className="mb-3 flex items-center">
          <img className="h-20" src={image} alt={title} />
        </div>
        <div className="mb-3 flex items-center">
          <h2 className="title-font text-lg font-medium text-aquamarine">
            {title}
          </h2>
        </div>
        <div className="grow">
          <ul>
            {items.map((item, index) => (
              <li key={index} className="mb-3 text-white">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { FeatureCard };
