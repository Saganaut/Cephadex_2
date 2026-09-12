import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormikContext } from "formik";
import React, {
  type ChangeEvent,
  type ReactElement,
  useRef,
  useState,
} from "react";

interface FileInputFieldProps {
  formik: any;
  name: string;
  textStyle?: string;
}

const FileInputField: React.FC<FileInputFieldProps> = ({
  formik,
  name,
  textStyle = "",
}): ReactElement => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileURL, setFileURL] = useState<string | null>(null);
  const fileInputRef = useRef(null);

  const handleChangeInFile = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile === undefined) {
        return;
      }
      setSelectedFileName(selectedFile.name);
      const fileURL = URL.createObjectURL(selectedFile);
      setFileURL(fileURL);

      // Assuming 'name' is a string
      void setFieldValue(name, selectedFile);
      void setFieldTouched(name, true);
      formik.validateField(name);
    }
  };
  const clearFile = (): void => {
    setSelectedFileName("");
    void setFieldValue(name, null);
  };
  return (
    <>
    {fileURL && (
        <div className="flex justify-center">
          <img
            src={fileURL}
            alt="Selected file"
            className="h-50 w-50 object-cover rounded-md mx-2"
          />
        </div>
      )}
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="flex w-full justify-start px-4 py-5 text-start"
    >
      <label
        htmlFor={name}
        className={`flex w-full cursor-pointer items-center justify-start dark:text-white text-tolopea ${textStyle}`}
      >
        <input
          ref={fileInputRef}
          name={name}
          className="w-full cursor-pointer"
          type="file"
          style={{ display: "none" }}
          id={name}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            e.stopPropagation();
            handleChangeInFile(e);
          }}
          onBlur={() => formik.handleBlur({ target: { name } })}
        />
        <ArrowUpTrayIcon className="h-5 w-5" />
        {selectedFileName.length > 0 ? (
          <>
            <div className="ml-2 flex items-center rounded-md bg-tolopea p-2">
              <span>
                {selectedFileName.length > 0 && (
                  <span className="p-2 text-blaze-orange"> 1 | </span>
                )}
              </span>
              <span className={`pr-2 text-sm text-white ${textStyle}`}>
                {selectedFileName}
              </span>
              <button
                type="button"
                className="h-6 w-6 rounded-full text-aquamarine hover:text-blaze-orange"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
              >
                <XMarkIcon />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full pl-4">Import image</div>
        )}
      </label>
    </div>
    </>
  );
};

export { FileInputField };
