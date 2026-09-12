import MagnifyingGlassIcon from "@assets/MagnifyingGlass.svg?react";
import { useDebouncedEffect } from "@source/lib/hooks/useDebouncedEffect";
import React from "react";

interface CommunityPageHeaderProps {
  deckSearchQuery: string;
  setDeckSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

const CommunityPageHeader: React.FC<CommunityPageHeaderProps> = ({
  deckSearchQuery,
  setDeckSearchQuery,
  handleSearch,
}) => {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    setDeckSearchQuery(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <>
      <div className=" ">
        <div className="flex-col md:px-[45px] md:py-[24px]  ">
          <div className="text-center text-tolopea dark:text-white">
            <h1 className="text-[45px] font-bold leading-[52px]">
              Ocean Archives
            </h1>
            <h3 className="text-lg font-medium">Waves of Wisdom</h3>
            <p className="hidden text-sm font-semibold md:block">
              Submerge into a sea of learning where every card is a drop of
              discovery.
            </p>
          </div>
          <div className="  mt-6 flex  justify-center">
            <div
              className={
                "relative w-full max-w-[400px] overflow-hidden rounded-full bg-electric-violet-200 dark:bg-mariana-blue"
              }
            >
              <div
                className={
                  "absolute left-[4px] top-[50%] flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-full text-white dark:bg-tolopea "
                }
              >
                <MagnifyingGlassIcon
                  stroke="#54FFF1"
                  className={
                    "h-[18px] w-[18px] overflow-visible rounded-full text-white dark:bg-tolopea"
                  }
                />
              </div>
              <input
                autoComplete={"on"}
                className="w-full appearance-none rounded-[14px]  bg-aquamarine/20  py-[8px] pl-[46px] pr-[18px]  text-[14px] leading-tight  text-white shadow placeholder:text-white/30 focus:outline-none dark:bg-electric-violet"
                type={"text"}
                placeholder={"Find a deck"}
                value={deckSearchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full rounded-r-[14px] bg-aquamarine  px-2 text-[14px] font-semibold leading-tight text-tolopea hover:bg-electric-violet hover:text-white focus:outline-none dark:bg-aquamarine dark:text-electric-violet dark:hover:bg-blaze-orange md:w-[100px]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { CommunityPageHeader };
