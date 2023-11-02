import React from "react";
import { RadioGroup } from "@headlessui/react";

interface CardTypeSelectorProps {
  name: string;
}

const CardTypeOption: React.FC<CardTypeSelectorProps> = ({ name }) => {
  {
    return (
      <RadioGroup.Option value={name}>
        {({ checked }) => (
          <span
            className={`border border-aquamarine   w-full flex justify-center items-center rounded-full px-8 py-2 ${
              checked ? "bg-aquamarine text-tolopea" : "text-aquamarine "
            }`}
          >
            {name}
          </span>
        )}
      </RadioGroup.Option>
    );
  }
};

export { CardTypeOption };
