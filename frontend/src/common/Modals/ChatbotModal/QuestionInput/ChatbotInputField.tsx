import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import React, { type Ref } from "react";
import { twMerge } from "tailwind-merge";

interface InputFieldProps {
  name: string;
  value: string | number;
  searchType?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder: string;
  label?: string;
  className?: string;
  setValue?: any;
  inputFieldRef?: Ref<HTMLInputElement>;
  dashed?: boolean;
  handleOnKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
}
const ChatbotInputField: React.FC<InputFieldProps> = ({
  name,
  inputFieldRef,
  value,
  onChange,
  onBlur,
  type,
  placeholder,
  label,
  className,
  setValue,
  dashed,
  searchType,
  handleOnKeyDown,
}) => {
  return (
    <div className={"relative w-full"}>
      {label != null && (
        <p
          className={twMerge(
            dashed === true
              ? "bg-mariana-blue-100 rounded-full text-white text-lg mb-[12px]  w-fit px-[32px] py-[4px]"
              : "pb-2 text-left text-[20px]  font-medium text-white"
          )}
        >
          {label}
        </p>
      )}
      <div
        className={`flex w-full appearance-none items-center rounded-[18px] border-[1px] dark:border-white border-electric-violet-200 bg-transparent px-[18px] py-[14px] text-[16px] leading-tight text-white shadow placeholder:font-normal placeholder:text-gray-400 focus:outline-none`}
      >
        <span className="text-blaze-orange">{searchType}</span>
        <input
          ref={inputFieldRef}
          min={1}
          autoComplete={"off"}
          className={`w-full appearance-none bg-transparent  dark:text-white text-tolopea shadow placeholder:font-normal placeholder:text-gray-400 focus:outline-none`}
          type={type}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          name={name}
          onKeyDown={handleOnKeyDown}
        />
      </div>

      {type === "number" && (
        <div
          className={
            "absolute right-[5px] top-[50%] flex -translate-y-1/2 flex-col gap-y-[2px]"
          }
        >
          <div
            onClick={() => {
              if (typeof value === "number") {
                setValue(value + 1);
              }
            }}
            className={"cursor-pointer rounded-t-full  bg-tolopea"}
          >
            <ChevronUpIcon
              className={"h-[12px] w-[18px] text-electric-violet"}
            />
          </div>
          <div
            onClick={() => {
              if (typeof value === "number" && value > 1) {
                setValue(value - 1);
              }
            }}
            className={"cursor-pointer rounded-b-full bg-tolopea"}
          >
            <ChevronDownIcon
              className={"h-[12px] w-[18px] text-electric-violet"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatbotInputField };
