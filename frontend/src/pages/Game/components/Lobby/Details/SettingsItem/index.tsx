import React from "react";

interface SettingsItemProps {
  title: string;
  value: number | string;
  Icon: any;
}
const SettingsItem: React.FC<SettingsItemProps> = ({ title, Icon, value }) => {
  return (
    <div
      className={
        "flex items-center justify-center gap-x-[10px] rounded-[12px] bg-mariana-blue sm:bg-mariana-blue-100 px-[12px] py-[16px] mb-4 2xl:mb-0"
      }
    >
      <div
        className={
          "flex h-[36px] w-[36px] min-w-[36px] items-center justify-center rounded-full border-[1.5px] border-white"
        }
      >
        <Icon className={"h-[24px] w-[24px] text-white"} />
      </div>
      <h1>{title}</h1>
      <h1 className={"rounded-md bg-white px-[14px] text-mariana-blue"}>
        {value}
      </h1>
    </div>
  );
};
export { SettingsItem };
