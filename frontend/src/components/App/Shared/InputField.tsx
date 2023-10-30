import React, { useState, useEffect } from "react";

const InputField = ({ name, value, onChange, onBlur, type, placeholder }) => {
  return (
    <div>
      <input
        className="shadow bg-mariana-blue appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

const TextAreaField = ({
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
        className="shadow bg-mariana-blue appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder={placeholder}
        rows="4"
        onBlur={onBlur}
        onChange={onChange}
        value={value}
        name={name}
        type={type}
      ></textarea>
    </div>
  );
};

export { InputField };
export { TextAreaField };
