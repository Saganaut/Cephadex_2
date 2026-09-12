import GroupIcon from "@assets/GroupOctopusIcon.svg";
import React from "react";

interface GroupImgProps {
  img: string | null | undefined;
}
const GroupImg: React.FC<GroupImgProps> = ({ img }) => {
  return (
    <>
      {" "}
      {img != null && img !== "None" ? (
        <img
          src={img}
          alt="icon"
          className={
            "h-[58px] w-[58px] rounded-full border-2 border-aquamarine"
          }
        />
      ) : (
        <img
          src={GroupIcon}
          alt="icon"
          className={
            "h-[58px] w-[58px] rounded-full border-2 border-aquamarine"
          }
        />
      )}
    </>
  );
};

export { GroupImg };
