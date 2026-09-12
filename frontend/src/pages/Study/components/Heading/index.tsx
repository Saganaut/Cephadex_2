import CephadexEllipse from "@assets/CephadexEllipse.png";
import React, { type ReactElement } from "react";

const Heading = (): ReactElement => {
  return (
    <>
      <img
        src={CephadexEllipse}
        className={
          "absolute left-[50%] top-[-138px] h-[174px] w-[174px] -translate-x-1/2"
        }
      />

      {/*   Heading */}
      <div className={"mb-[80px] text-center "}>
        <h1 className={"text-[24px] font-bold text-aquamarine"}>
          Ready to get some studying done?
        </h1>
        <p className={"text-[18px] text-aquamarine"}>
          Dive in to an ocean of knowledge
        </p>
      </div>
    </>
  );
};
export { Heading };
