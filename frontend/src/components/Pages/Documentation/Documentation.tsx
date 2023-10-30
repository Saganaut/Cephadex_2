import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { CollapsableCard } from "@pages/Documentation/CollapsableCard";
import { CreateHowTo } from "@pages/Documentation/CreateHowTo";

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

const Documentation = () => {
  return (
    <>
      <div className="container px-5 py-20 mx-auto">
        <h1 className="flex justify-center text-5xl font-bold text-electric-violet p-3 ">
          Documentation
        </h1>

        <>
          {Guide.map((guide, index) => (
            <div>
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
