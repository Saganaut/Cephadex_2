import InfoIcon from "@assets/InfoIcon.svg?react";
import React from "react";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  content: string;
  bgColor?: string;
}
const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  content,
  bgColor,
}) => {
  return (
    <>
      <div className="w-fit text-white">
        <div className="mb-[4px] flex w-full items-center rounded-full bg-electric-violet-700 px-[6px] py-[4px] dark:bg-tolopea sm:mb-[16px]">
          <div
            className={`flex h-[20px] w-[20px] items-center justify-center rounded-full ${bgColor}`}
          >
            {icon}
          </div>
          <p className="whitespace-nowrap px-[10px] font-medium sm:px-[30px]">
            {content}
          </p>
        </div>
        <div className="w-full ">
          <div className="flex items-center justify-between gap-1 text-xs sm:gap-0 sm:text-base">
            <p>{label}</p>
            <InfoIcon className="h-[13px] w-[13px]" />
          </div>
          <div className={`mt-[6px] h-[3px] w-full rounded-full ${bgColor} `} />
        </div>
      </div>
    </>
  );
};

export { InfoItem };
