import React, { useState, useRef } from "react";
import { useFormikContext } from "formik";

const FileInputField = ({ formik, name, onBlur }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleChangeInFile = (e) => {
    console.log("HANDLING CHANGE IN FILE");
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log("Selected file is:", selectedFile);
      console.log("Selected file name is:", name);
      setSelectedFileName(selectedFile.name);
      setFieldValue(name, selectedFile);
      setFieldTouched(name, true);
      console.log("Updated formik values:", formik.values);
      console.log("Updated formik touched fields:", formik.touched);
      console.log("Updated formik errors:", formik.errors);
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
