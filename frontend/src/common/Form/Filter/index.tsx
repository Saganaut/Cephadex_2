import { Dropdown } from "@common/Form/Dropdown";
import ArrowSmallUpIcon from "@heroicons/react/20/solid/ArrowSmallUpIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { Form, Formik } from "formik";
import React from "react";

interface FilterProps {
  sortOptions: Array<{ value: number; label: string }>;
}
const Filter: React.FC<FilterProps> = ({ sortOptions }) => {
  return (
    <Formik
      initialValues={{
        searchField: "",
        sortField: "",
      }}
      validateOnBlur={true}
      onSubmit={(values) => {
        console.log("submit ----------------------------------");
        console.log(values);
      }}
    >
      {(formik) => (
        <Form>
          <div className={"ml-auto flex w-[60%] gap-x-[36px]"}>
            {/* Search */}
            <div className={"relative w-full"}>
              <MagnifyingGlassIcon
                className={
                  "absolute left-[10px] top-[50%] h-[18px] w-[18px] -translate-y-1/2 text-aquamarine"
                }
              />
              <input
                autoComplete={"off"}
                className="w-full appearance-none rounded-[14px]  bg-tolopea py-[8px] pl-[38px]  pr-[18px] text-[14px]  leading-tight text-aquamarine shadow placeholder:text-aquamarine/30 focus:outline-none"
                type={"text"}
                placeholder={"Search for a deck"}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.searchField}
                name={"searchField"}
              />
            </div>

            {/* Sort */}
            <div className={"flex w-full gap-x-[4px]"}>
              <div
                className={
                  "flex h-full w-[38px] min-w-[38px] items-center justify-center rounded-full bg-tolopea"
                }
              >
                <ArrowSmallUpIcon className={"w-[20px] text-aquamarine"} />
              </div>
              <Dropdown
                style={"sort"}
                options={sortOptions}
                value={formik.values.sortField}
                name={"sortField"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export { Filter };
