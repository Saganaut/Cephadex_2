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

interface TextAreaFieldProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label?: string;
}
const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  onBlur,
  onChange,
  value,

  placeholder,
}) => {
  return (
    <div>
      <textarea
        className="focus:shadow-outline w-full appearance-none rounded border bg-mariana-blue px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        placeholder={placeholder}
        rows={4}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
        name={name}
      ></textarea>
    </div>
  );
};

export { InputField };
export { TextAreaField };
