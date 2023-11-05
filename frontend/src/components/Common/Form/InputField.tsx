import React from "react";

interface InputFieldProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder: string;
  label?: string;
}
const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  type,
  placeholder,
  label,
}) => {
  return (
    <div>
      <p className={"pb-2 text-[20px] font-medium text-white"}>{label}</p>
      <input
        autoComplete={"off"}
        className="w-full appearance-none rounded-[18px] border bg-transparent px-[18px]  py-[20px] text-[18px] leading-tight text-aquamarine shadow placeholder:text-aquamarine/30 focus:outline-none"
        type={type}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
        name={name}
      />
    </div>
  );
};

export { InputField };
