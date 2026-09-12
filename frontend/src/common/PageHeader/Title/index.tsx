import React from "react";

interface TitleProps {
  title: string;
}
const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <h1
      className={
        "text-[22px] font-bold leading-normal  sm:text-[28px] lg:text-[40px] lg:leading-[60px]"
      }
    >
      {title}
    </h1>
  );
};

export { Title };
