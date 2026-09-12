import React from "react";

interface InputedFieldProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  type: string;
  placeholder: string;
}

const InputField: React.FC<InputedFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  type,
  placeholder,
}) => {
  return (
    <div>
      <input
        className=" w-full appearance-none rounded border bg-mariana-blue px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
  onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  type: string;
  placeholder: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  onBlur,
  onChange,
  value,
  type,
  placeholder,
}) => {
  return (
    <div>
      <textarea
        className=" w-full appearance-none rounded border bg-mariana-blue px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={onChange}
        rows={4}
        value={value}
        name={name}
        // Remove the 'type' prop
      ></textarea>
    </div>
  );
};

export { InputField };
export { TextAreaField };
