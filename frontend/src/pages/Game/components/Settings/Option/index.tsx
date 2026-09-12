import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface OptionProps {
  title: string;
  description: string;
  Icon: any;
  state: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
  min?: number;
  max?: number;
  input?: boolean;
  incrementBy?: number;
}
const Option: React.FC<OptionProps> = ({
  title,
  description,
  Icon,
  setState,
  state,
  min,
  max,
  input,
  incrementBy,
}) => {
  const handleStateChange = (value: number): void => {
    setState((prevState) => {
      if (min != null && prevState + value < min) {
        return min;
      }
      if (max != null && prevState + value > max) {
        return max;
      }
      return prevState + value;
    });
  };
  return (
    <div
      className={
        "group flex w-full items-center gap-x-[10px] rounded-[12px] bg-aquamarine-100 p-[20px]  hover:bg-electric-violet dark:bg-mariana-blue-100"
      }
    >
      <div
        className={
          "flex h-[36px] w-[36px] min-w-[36px] items-center justify-center rounded-full border-[1.5px] border-tolopea dark:border-white"
        }
      >
        <Icon className={"h-[24px] w-[24px] text-black dark:text-white"} />
      </div>

      <div className={"w-full"}>
        <h1
          className={
            "select-none text-lg font-medium dark:text-white text-tolopea"
          }
        >
          {title}
        </h1>
        <div className={"flex w-full items-center justify-between"}>
          <p
            className={
              "select-none text-sm text-tolopea group-hover:text-mariana-blue dark:text-gray-300"
            }
          >
            {description}
          </p>
          <div className={"flex items-center gap-3"}>
            <MinusCircleIcon
              onClick={() => {
                handleStateChange(incrementBy != null ? -incrementBy : -1);
              }}
              className={
                "h-[26px] w-[26px] cursor-pointer text-tolopea dark:text-white"
              }
            />
            {input === true ? (
              <input
                type={"number"}
                value={state === 0 ? "Infinite" : state}
                min={min}
                max={max}
                placeholder={"Infinite"}
                onChange={(e) => {
                  setState(parseInt(e.currentTarget.value));
                }}
                className={"w-[75px] bg-transparent text-center outline-none"}
              />
            ) : (
              <p
                className={
                  "select-none font-medium text-tolopea dark:text-white"
                }
              >
                {state === 0 ? "Infinite" : state}
              </p>
            )}
            <PlusCircleIcon
              onClick={() => {
                handleStateChange(incrementBy ?? +1);
              }}
              className={
                "h-[26px] w-[26px] cursor-pointer text-tolopea dark:text-white"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export { Option };
