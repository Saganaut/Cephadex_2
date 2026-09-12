import { Dropdown } from "@common/Form/Dropdown";
import ArrowSmallUpIcon from "@heroicons/react/20/solid/ArrowSmallUpIcon";
import React from "react";

interface SimpleFilterProps {
  searchPlaceHolder: string;
  sortOptions?: Array<{ value: number; label: string }>;
  sortValue?: { value: number; label: string };
  setSortValue?: React.Dispatch<
    React.SetStateAction<{ value: number; label: string }>
  >;
  order: "desc" | "asc";
  setOrder: React.Dispatch<React.SetStateAction<"desc" | "asc">>;
}
const SimpleFilter: React.FC<SimpleFilterProps> = ({
  sortOptions,
  sortValue,
  setSortValue,
  order,
  setOrder,
}) => {
  return (
    <div className={"flex w-full justify-between gap-x-[36px]"}>
      {/* Search */}

      <div className={"flex w-full gap-x-[4px] "}>
        <div
          className={
            "flex h-full w-[38px] min-w-[38px] items-center justify-center rounded-full dark:bg-tolopea"
          }
        >
          <button
            type="button"
            className={
              "flex h-full w-[38px] min-w-[38px] items-center justify-center rounded-full bg-aquamarine dark:bg-tolopea"
            }
            onClick={() => {
              const nextSortOrder = order === "asc" ? "desc" : "asc";
              setOrder(nextSortOrder);
            }}
          >
            <ArrowSmallUpIcon
              className={`w-[20px] text-tolopea dark:text-aquamarine ${
                order === "desc" ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        {/* SORT */}

        <Dropdown
          style={"sort"}
          options={sortOptions}
          value={sortValue}
          name={"sortField"}
          onChange={setSortValue}
          secondStyle={"shallows"}
        />
      </div>
    </div>
  );
};

export { SimpleFilter };
