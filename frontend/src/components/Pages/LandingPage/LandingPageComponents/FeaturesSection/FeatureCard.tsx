import React from "react";

const FeatureCard = ({ title, image, items }) => {
  return (
    <div className="p-4 md:w-1/3">
      <div className="flex rounded-lg h-full bg-mariana-blue p-8 flex-col border border-aquamarine">
        <div className="flex items-center mb-3">
          <img className="h-20" src={image} alt={title} />
        </div>
        <div className="flex items-center mb-3">
          <h2 className="text-aquamarine text-lg title-font font-medium">
            {title}
          </h2>
        </div>
        <div className="flex-grow">
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
