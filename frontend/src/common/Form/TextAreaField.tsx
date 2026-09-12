import React from "react";

interface TextAreaFieldProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label?: string;
  type?: string;
  style?: string;
  textStyle?: string;
}
const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  onBlur,
  onChange,
  value,
  label,
  style,
  placeholder,
  textStyle = "",
}) => {
  return (
    <div className={style}>
      <p
        className={`pb-2 text-left text-[20px] font-medium text-tolopea dark:text-white ${textStyle}`}
      >
        {label}
      </p>
      <textarea
        className={`w-full appearance-none rounded-t-[18px] rounded-bl-[18px] border-[1px] border-slate-400 bg-transparent px-[18px] py-[12px] text-[18px] leading-tight text-tolopea shadow placeholder:text-gray-500 focus:outline-none dark:border-white dark:text-white ${textStyle}`}
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

export { TextAreaField };
