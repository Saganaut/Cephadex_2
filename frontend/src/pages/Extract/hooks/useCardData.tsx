import { useFormikContext } from "formik";

import type ExtractFormValues from "../data/ExtractFormValues";

const useCardData = (): {
  sourceType: string;
  checkedSource: string;
  cardType: string;
  checkedExtras: string;
  language: string;
  subject: string;
  detail: string;
  errorMessage: string;
} => {
  const formik = useFormikContext<ExtractFormValues>(); // Access Formik values with a type
  const sourceType =
    formik.values.linkField !== null &&
    formik.values.linkField !== undefined &&
    formik.values.linkField !== ""
      ? "link"
      : formik.values.fileField !== null &&
        formik.values.fileField !== undefined &&
        formik.values.fileField.name !== ""
      ? "file"
      : formik.values.textField !== null &&
        formik.values.textField !== undefined &&
        formik.values.textField !== ""
      ? "text"
      : "";

  const source =
    sourceType === "link"
      ? formik.values.linkField
      : sourceType === "file" && formik.values.fileField !== null
      ? formik.values.fileField.name
      : formik.values.textField !== null &&
        formik.values.textField !== undefined &&
        formik.values.textField !== ""
      ? formik.values.textField.substring(0, 20)
      : null;

  const cardType =
    formik.values.cardTypeField === "Mix"
      ? "Mix - Multiple choice and Definitions"
      : formik.values.cardTypeField === "Mcq"
      ? "Multiple Choice"
      : formik.values.cardTypeField === "Cloze"
      ? "Fill in the blank"
      : formik.values.cardTypeField;

  const extras = formik.values.multiOptionsField
    .filter(
      (option: string) => typeof option === "string" && option.trim() !== ""
    )
    .join(", ");

  const checkedExtras = extras !== "" ? extras : "None";
  const language = formik.values.languageField;
  const subject =
    formik.values.subjectField === "" ||
    formik.values.subjectField === "Unspecified"
      ? "None"
      : formik.values.subjectField;
  const detail =
    formik.values.detailField !== "" ? formik.values.detailField : "None";
  const checkedSource = source ?? "None";

  const errorMessage = "Oops! looks like there are a couple things missing ";
  // Object.values(formik.errors).join(" --   ");

  return {
    sourceType,
    checkedSource,
    cardType,
    language,
    subject,
    detail,
    checkedExtras,
    errorMessage,
  };
};

export { useCardData };
