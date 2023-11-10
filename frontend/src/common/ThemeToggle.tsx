import DarkModeIcon from "@assets/DarkModeIcon.svg";
import LightModeIcon from "@assets/LighModeIcon.svg";
import React, { type ReactElement, useEffect, useState } from "react";

const ThemeToggle = (): ReactElement => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const existingPreference = localStorage.getItem("dark-mode");
    return existingPreference != null ? JSON.parse(existingPreference) : false;
  });

  useEffect(() => {
    localStorage.setItem("dark-mode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <button
      className="text-black  dark:text-white"
      onClick={() => {
        setDarkMode(!darkMode);
      }}
    >
      <img
        src={darkMode ? LightModeIcon : DarkModeIcon}
        alt="avatar-img"
        className={"h-[43px] w-[44px]"}
      />
    </button>
  );
};

export { ThemeToggle };
