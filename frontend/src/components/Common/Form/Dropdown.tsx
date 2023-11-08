import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useField, useFormikContext } from "formik";
import React, { Fragment, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DropdownProps {
  label?: string;
  options: Array<{ label: string; value: string | number }> | any[];
  value: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style: "select" | "sort";
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  onBlur,
  name,
  style,
}) => {
  // const [selected, setSelected] = useState(
  //   options[0] || { label: "", value: "" }
  // );
  const [query, setQuery] = useState("");
  const [field, meta, helpers] = useField(name);
  const { setFieldValue, values } = useFormikContext();
  const selected = values[name];
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const inputClassName = twMerge(
    "w-full px-[18px] font-medium text-aquamarine focus:outline-none focus:outline-0 focus:ring-0",
    `${
      style === "select"
        ? "py-[20px] leading-5 text-[18px] rounded-[18px] bg-transparent border-[1px] border-black-white"
        : "py-[8px] text-[12px] rounded-[14px] bg-tolopea"
    }`
  );

  return (
    <div className="w-full">
      {/* Label */}

      {label && (
        <p className={"pb-2 text-[20px] font-medium text-white"}>
          {label} - {selected.label}
        </p>
      )}

      <Combobox
        value={selected}
        onChange={(option) => {
          console.log("Combobox change detected:", name, option);
          // setSelected(option); // Update local state
          setFieldValue(name, option); // Update Formik state
        }}
      >
        <div className="relative">
          <div
            className={`relative w-full cursor-default overflow-hidden rounded-lg bg-transparent text-left ${
              style === "select" ? "shadow-md" : "shadow-none"
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm`}
          >
            <Combobox.Input
              className={inputClassName}
              displayValue={(option: { value: number; label: string }) =>
                option.label
              }
              onBlur={onBlur}
              name={name}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-[35px] w-[35px] text-aquamarine"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              setQuery("");
            }}
          >
            <Combobox.Options className="absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-aquamarine text-gray-900" : "text-gray-900"
                      }`
                    }
                    value={option}
                    onChange={() => {
                      console.log("option selected is", name, option);
                      setSelected(option);
                      setFieldValue(name, option);
                    }}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-gray-900" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
export { Dropdown };
