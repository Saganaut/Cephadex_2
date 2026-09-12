import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { type FormikProps } from "formik";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { twMerge } from "tailwind-merge";

interface MCQBackProps {
  status: string | null;
  formik: FormikProps<any>;
  name: string;
  changedValues?: string[];
  index: number;
  type: "Quiz" | "Study" | "Cards";
  editType?: "new" | "edit";
  label?: string;
  error?: boolean;
}
const MCQBack: React.FC<MCQBackProps> = ({
  formik,
  changedValues,
  status,
  name,
  index,
  type,
  editType = "edit",
  label,
  error = false,
}) => {
  return (
    <div className={"flex items-center gap-x-[10px]"}>
      {type === "Quiz" && (
        <div
          className={
            "flex size-[42px] min-w-[42px] items-center justify-center rounded-full bg-aquamarine "
          }>
          <h1 className={"text-[14px] font-medium text-tolopea"}>
            {String.fromCharCode(65 + index)}
          </h1>
        </div>
      )}
      {editType === "new" && (
        <>
          <h1
            className={
              " my-4 hidden min-w-[80px] rounded-full bg-electric-violet-200 py-1 text-tolopea/50 dark:bg-mariana-blue-100 dark:text-white  sm:block sm:max-w-min sm:px-8"
            }>
            {label}
          </h1>
          <div className='sm:hidden '>
            {label === "Correct" ? (
              <CheckIcon className='size-6 text-tolopea/50 dark:text-white ' />
            ) : (
              <div>
                <XMarkIcon className='size-6 text-tolopea/50 dark:text-white ' />
              </div>
            )}
          </div>
        </>
      )}
      <TextareaAutosize
        minRows={1}
        maxRows={3}
        name={name}
        id={name}
        className={twMerge(
          `my-2 max-h-[120px] w-full overflow-hidden sm:rounded-full rounded-xl border-2 bg-transparent px-[32px] py-2 text-center text-[18px] dark:text-white text-tolopea/50  ${
            status === "success"
              ? "border-solid dark:border-white border-slate-400"
              : "border-dashed border-mariana-blue-100 sm:border-mariana-blue"
          }`,
          `${
            editType === "edit" &&
            (changedValues?.includes("term") === true
              ? "bg-mariana-blue"
              : "bg-transparent")
          }`,
          `${error ? "border-red-500" : ""}`
        )}
        onChange={formik.handleChange}
        value={formik.values[name]}
      />
    </div>
  );
};
export { MCQBack };
