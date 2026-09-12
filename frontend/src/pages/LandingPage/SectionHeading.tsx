import React from "react";

interface SectionHeadingProps {
  title: string;
  message: string;
}
const SectionHeading: React.FC<SectionHeadingProps> = ({ title, message }) => {
  return (
    <>
      {" "}
      <div className="mb-20 flex w-full flex-col text-center">
        <h1 className="  sm:text-[70px] text-[24px] text-aquamarine">
          {title}{" "}
        </h1>
        <h2 className=" mb-1 text-xs sm:text-base font-medium tracking-widest text-white">
          {message}
        </h2>
      </div>
    </>
  );
};

export { SectionHeading };
