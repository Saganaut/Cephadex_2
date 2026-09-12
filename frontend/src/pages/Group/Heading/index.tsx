import React from "react";

interface HeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
}
const Heading: React.FC<HeadingProps> = ({ subtitle, title, description }) => {
  return (
    <div
      className={
        "relative mb-[30px] w-full rounded-[18px] bg-mariana-blue px-[45px] py-[24px] text-white"
      }
    >
      <div>
        <h1 className={"max-w-[70%] text-[45px] font-bold leading-[52px]"}>
          {title}
        </h1>
        <p className={"text-lg font-medium"}>{subtitle}</p>
        <p className={"pt-[55px] text-lg font-semibold"}>{description}</p>
      </div>
    </div>
  );
};

export { Heading };
