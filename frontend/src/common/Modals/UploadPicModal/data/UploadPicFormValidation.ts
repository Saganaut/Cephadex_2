import * as Yup from "yup";

const MAX_FILE_SIZE = 1; // 1MB
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const UploadPicFormValidation = Yup.object().shape({
  file: Yup.mixed()
    .required("Please upload a file")
    .test(
      "fileSize",
      "File too large (1MB max)",
      (value) => value && (value as File).size <= 1024 * 1024 * MAX_FILE_SIZE // 1MB
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) =>
        value &&
        ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type)
    )
    .test(
      "fileResolution",
      "Resolution too high, please upload a file with a resolution of 1024x1024 or less",
      async (value) =>
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve(img.width <= MAX_WIDTH && img.height <= MAX_HEIGHT);
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(value as File);
        })
    ),
});

export { UploadPicFormValidation };
