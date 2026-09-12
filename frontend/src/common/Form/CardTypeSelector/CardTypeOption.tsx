import { RadioGroup } from "@headlessui/react";
import React from "react";

import { Tooltip } from "../Tooltip";

interface CardTypeOptionProps {
  cardType: {
    label: string;
    value: string;
    description: string;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  };
  size: "small" | "large";
}

const CardTypeOption: React.FC<CardTypeOptionProps> = ({ cardType, size }) => {
  const Icon = cardType.icon;

  // const iconClasses = size === "small" ? "h-12" : "h-40";

  return (
    <RadioGroup.Option value={cardType.label}>
      {({ checked }) => (
        <>
          {size === "small" ? (
            <Tooltip position="top" text={cardType.label}>
              <div
                className={`
                    mx-auto  flex w-fit cursor-pointer justify-between gap-x-[20px] self-center rounded-full   p-[8px]
                  ${
                    checked
                      ? "bg-electric-violet-700 dark:bg-mariana-blue"
                      : "bg-electric-violet dark:bg-tolopea"
                  }`}
              >
                <Icon className="h-[24px] w-[24px]" />
              </div>
            </Tooltip>
          ) : (
            <div>
              <div
                className={`min-h-[300px] overflow-hidden rounded-lg p-4 shadow-md ${
                  checked ? "bg-electric-violet" : "bg-tolopea"
                }`}
              >
                <div
                  className={` flex h-40  w-full items-center justify-center rounded-t-lg object-cover${
                    checked ? "bg-mariana-blue" : "bg-mariana-blue"
                  }`}
                >
                  <Icon />
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-bold text-white">
                    {cardType.label}
                  </h2>

                  <p className="text-white">{cardType.description}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </RadioGroup.Option>
  );
};

export { CardTypeOption };
