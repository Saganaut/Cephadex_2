import React from "react";

interface InputRangeFieldProps {
  id: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  type?: "seconds" | "float" | "int" | "minutes";
  label: string;
}
const InputRangeField: React.FC<InputRangeFieldProps> = ({
  id,
  min,
  max,
  value,
  label,
  onChange,
  type = "int",
}) => {
  const formattedValue = type === "seconds" ? (value / 3600).toFixed(2) : value;
  return (
    <>
      {" "}
      <div className="sm:max-w-[400px] max-w-[200px] py-1  ">
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-white"
        >
          {label}{" "}
        </label>
        <div className="flex  items-center justify-between gap-4 ">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              onChange(Number(e.target.value));
            }}
            className="h-2 w-[300px] cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-electric-violet-900  to-electric-violet-200 ring-blaze-orange dark:bg-gray-700"
          />
          <p>{formattedValue}</p>
        </div>
      </div>
    </>
  );
};

export { InputRangeField };
