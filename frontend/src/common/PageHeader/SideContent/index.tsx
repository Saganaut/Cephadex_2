import CephOldTeacher from "@assets/bubbles/CephOldTeacher.png";
// import DefaultHeaderImg from "@assets/DefaultHeaderImg.svg?react";
import React from "react";

interface SideContentProps {
  img?: string | null;
}
const SideContent: React.FC<SideContentProps> = ({ img }) => {
  return (
    <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-aquamarine">
      {img == null ? (
        // <DefaultHeaderImg className={"h-[200px] w-[200px] rounded-xl"} />
        <img
          src={CephOldTeacher}
          alt="Profile"
          className="h-[200px] w-[200px] rounded-xl"
        />
      ) : (
        <img
          src={img}
          alt="Profile"
          className="h-[200px] w-[200px] rounded-xl bg-aquamarine"
        />
      )}
    </div>
  );
};

export { SideContent };
