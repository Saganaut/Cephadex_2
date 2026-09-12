import * as Yup from "yup";

const MAX_FILE_SIZE = 1; // 1MB
// const MAX_WIDTH = 500;
// const MAX_HEIGHT = 500;
const CreateGroupFormValidation = Yup.object().shape({
  name: Yup.string()
    .min(5, "Name must be between 5 and 30 characters long.")
    .max(30, "Name must be between 5 and 30 characters long.")
    .required("Please choose a group name"),
  groupType: Yup.string()
    .required("Please chose a type")
    .min(5, "Type must be between 5 and 30 characters long.")
    .max(30, "Type must be between 5 and 30 characters long."),
  description: Yup.string().max(
    255,
    "Description must be less than 255 characters long."
  ),
  img: Yup.mixed()
    .nullable()
    .default(null)
    .test(
      "fileSize",
      "File too large (1MB max)",
      (value) =>
        value == null || (value as File).size <= 1024 * 1024 * MAX_FILE_SIZE // 1MB
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) =>
        value == null ||
        ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type)
    ),
  //   private: Yup.string().required("Please select a feedback type"),
});

export { CreateGroupFormValidation };
