import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import React from "react";

interface SearchProps {
  searchPlaceHolder: string;
  inputText: string;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  style?: "shallows" | "depths";
}
const Search: React.FC<SearchProps> = ({
  searchPlaceHolder,
  inputText,
  handleInputChange,
  style,
}) => {
  return (
    <>
      {" "}
      <div className={`relative w-full max-w-[400px] `}>
        <MagnifyingGlassIcon
          className={
            "absolute left-[10px] top-[50%] h-[18px] w-[18px] -translate-y-1/2 text-tolopea dark:text-aquamarine"
          }
        />
        <input
          autoComplete={"off"}
          className={`${
            style === "shallows"
              ? "bg-aquamarine/40 dark:bg-mariana-blue-100 "
              : "bg-black-white dark:bg-tolopea"
          } w-full appearance-none rounded-[14px]   py-[8px] pl-[38px]  pr-[18px] text-[14px]  leading-tight text-tolopea shadow placeholder:text-tolopea/80 focus:outline-none dark:text-aquamarine  dark:placeholder:text-aquamarine/30`}
          type={"text"}
          placeholder={searchPlaceHolder}
          value={inputText}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};

export { Search };
