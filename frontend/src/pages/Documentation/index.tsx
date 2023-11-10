import { CollapsableCard } from "@documentation/CollapsableCard";
import { CreateHowTo } from "@documentation/CreateHowTo";
import React, { type ReactElement } from "react";

const Guide = [
  {
    title: "Getting Started",
    content: "Getting Started",
  },
  {
    title: "Create",
    content: <CreateHowTo />,
  },
];

const Documentation = (): ReactElement => {
  return (
    <>
      <div className="container mx-auto px-5 py-20">
        <h1 className="flex justify-center p-3 text-5xl font-bold text-electric-violet ">
          Documentation
        </h1>

        <>
          {Guide.map((guide, index) => (
            <div key={index}>
              <CollapsableCard
                key={index}
                title={guide.title}
                content={guide.content}
              />
            </div>
          ))}
        </>
      </div>
    </>
  );
};

export { Documentation };
