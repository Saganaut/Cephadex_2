import React, { useState, useRef } from "react";
import { useFormikContext } from "formik";

const FileInputField = ({ formik, name, onBlur }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleChangeInFile = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setSelectedFileName(selectedFile.name);
      setFieldValue(name, selectedFile);
      setFieldTouched(name, true);
      setFieldValue(name, selectedFile, () => {
        setFieldTouched(name, true, () => {
          formik.validateField(name);
        });
      });
    }
  };
  const clearFile = () => {
    setSelectedFileName("");
    setFieldValue(name, null);
  };
  return (
    <div className="relative inline-block w-full text-gray-700">
      <input
        ref={fileInputRef}
        name={name}
        className="w-full bg-white text-base placeholder-gray-600 border border-red-500 rounded-lg focus:shadow-outline"
        type="file"
        style={{ display: "none" }}
        id={name}
        onChange={handleChangeInFile}
        onBlur={() => formik.handleBlur({ target: { name } })}
      />
      <label
        htmlFor={name}
        className="px-3 py-2 bg-blue-600 text-white cursor-pointer rounded-lg"
      >
        Upload
      </label>
      {selectedFileName && (
        <>
          <span className="bg-marian-blue border p-2 rounded-md border-color-mariana-blue-200 text-gray-300 ml-3 text-sm">
            {selectedFileName}
          </span>
          <button
            type="button"
            className="ml-3 px-3 py-2 bg-red-600 text-white cursor-pointer rounded-lg"
            onClick={clearFile}
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
};

export { FileInputField };
