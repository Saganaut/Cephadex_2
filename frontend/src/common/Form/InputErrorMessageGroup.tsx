import { type FormikErrors, type FormikTouched } from "formik";
import React from "react";

type Values = Record<string, any>;

interface InputErrorMessageGroupProps {
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
}
// TODO add better typing here (errors can be string or object?)
const InputErrorMessageGroup: React.FC<InputErrorMessageGroupProps> = ({
  errors,
  touched,
}) => {
  return (
    <>
      {Object.keys(errors).map((key, index) => (
        <div
          key={index}
          className={`mt-2 text-sm text-red-500 ${
            touched[key] ? "visible" : "invisible" // eslint-disable-line
          } h-5`}
        >
          <p>
            {" "}
            {typeof errors[key] === "string"
              ? (errors[key] as string)
              : JSON.stringify(errors[key])}
          </p>
        </div>
      ))}
    </>
  );
};

export { InputErrorMessageGroup };
