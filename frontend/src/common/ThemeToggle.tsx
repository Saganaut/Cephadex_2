import DarkModeIcon from "@assets/DarkModeIcon.svg?react";
import LightModeIcon from "@assets/LightModeIcon.svg?react";
import React, { useEffect, useState, FC } from "react";

const ThemeToggle: FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const existingPreference = localStorage.getItem("dark-mode");
    return existingPreference != null ? JSON.parse(existingPreference) : true;
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
      className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-electric-violet"
      onClick={() => {
        setDarkMode(!darkMode);
      }}
    >
      {darkMode ? (
        <LightModeIcon className="h-[28px] w-[28px] sm:h-[38px] sm:w-[38px]" />
      ) : (
        <DarkModeIcon className="h-[28px] w-[28px] sm:h-[38px] sm:w-[38px]" />
      )}
    </button>
  );
};

export { ThemeToggle };
