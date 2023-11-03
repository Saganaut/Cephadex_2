import React from "react";

interface TextAreaFieldProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label?: string;
  type?: string;
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
        className="focus:shadow-outline w-full appearance-none rounded-2xl border bg-tolopea px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
