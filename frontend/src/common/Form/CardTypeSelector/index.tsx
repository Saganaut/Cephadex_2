import { RadioGroup } from "@headlessui/react";
import { CardTypeOption } from "@source/common/Form/CardTypeSelector/CardTypeOption";
import React from "react";

interface CardType {
  label: string;
  value: string;
  description: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

interface CardTypeSelectorProps {
  name: string;
  card: any;
  onChange: (value: any) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  size: "large" | "small";
  cardTypes: CardType[];
}
const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({
  name,
  card,
  onChange,
  onBlur,
  size,
  cardTypes,
}) => {
  const classLarge =
    "mx-auto mb-8 max-w-md  px-2 sm:w-full md:w-1/2 lg:w-1/3 lg:max-w-none";
  const classSmall = "flex items-center justify-center    ";
  const mappingClass = size === "small" ? classSmall : classLarge;
  return (
    <RadioGroup name={name} value={card} onChange={onChange} onBlur={onBlur}>
      <div
        className={`flex flex-wrap gap-4 ${
          size === "small"
            ? "items-center justify-between gap-2 rounded-full sm:dark:bg-mariana-blue-100 sm:bg-electric-violet-200 sm:px-[14px] py-[6px]"
            : ""
        }`}
      >
        {cardTypes.map((cardType, index) => (
          <div key={index} className={`${mappingClass}`}>
            <CardTypeOption cardType={cardType} size={size} />{" "}
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

export { CardTypeSelector };
