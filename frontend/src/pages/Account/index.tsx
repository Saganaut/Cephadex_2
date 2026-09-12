// import { useUser } from "@contexts/UserContext";
import { Plans } from "@account/Plans";
import { PreferencesSelect } from "@source/common/Form/PreferencesSelect/PreferencesSelect";
import { useFetchUser } from "@source/lib/hooks/userHooks/useFetchUser";
import React from "react";

import { DataTab } from "./DataTab";
import { Personal } from "./Personal";
import { SettingsTab } from "./SettingsTab";

// const roles: Array<{ value: number; label: string }> = [
//   { value: 0, label: "None" },
//   { value: 1, label: "Student" },
//   { value: 2, label: "Teacher" },
//   { value: 3, label: "Other" },
// ];

const options = [
  {
    label: "Personal",
    value: "personal",
    icon: null,
  },
  {
    label: "Plan",
    value: "Plan",
    icon: null,
  },
  {
    label: "Data",
    value: "data",
    icon: null,
  },
  {
    label: "Settings",
    value: "settings",
    icon: null,
  },
];
const Account: React.FC = () => {
  const { user, userStatus, refreshUser, userSettings } = useFetchUser();
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className={" px-[10px] pt-[100px] md:px-[64px] md:pt-[185px]"}>
      {/*   Content */}
      <div className={"w-full "}>
        <div className="mb-4 flex w-full text-lg md:mb-0">
          <div className="flex h-full flex-col justify-center">
            {/* <h1 className={"mb-2 text-[24px] font-semibold text-blaze-orange"}>
              Account
            </h1> */}
            <PreferencesSelect
              label={""}
              setActiveIndex={setActiveIndex}
              activeIndex={activeIndex}
              options={options}
            />
          </div>
        </div>
        <div className="mb-10">
          {activeIndex === 0 && <Personal user={user} />}
          {activeIndex === 1 && <Plans user={user} />}
          {activeIndex === 2 && <DataTab user={user} />}
          {activeIndex === 3 && (
            <SettingsTab user={user} settings={userSettings} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Account;
