import * as Yup from "yup";
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

const FILE_SIZE = 1 * 1024 * 1024; // 2MB
const SUPPORTED_EXTENSIONS = [
  ".mp3",
  ".wav",
  ".pptx",
  ".pdf",
  ".docx",
  ".txt",
  ".ppt",
];

const validationSchema = Yup.object()
  .shape({
    fileField: Yup.mixed()
      .nullable()
      .test(
        "fileExtension",
        "Unsupported file format. Supported formats include: .mp3, .wav, .pptx, .pdf, .docx, .txt.",
        (value) => {
          if (!value) return true;
          const fileExtension = `.${value.name.split(".").pop()}`;
          console.log("file extension:", fileExtension);
          return SUPPORTED_EXTENSIONS.includes(fileExtension);
        }
      )
      .test("fileSize", `File too large`, (value) => {
        console.log("Selected file:", value);
        if (!value) return true;
        console.log("File size:", value.size);
        const tooBig = value.size <= FILE_SIZE;
        console.log("too big", tooBig);
        return tooBig;
      }),
    nameField: Yup.string(),

    linkField: Yup.string().test("url", "Invalid URL format", (value) => {
      if (!value) return true; // If you want to allow empty values
      return urlRegex.test(value);
    }),
    textField: Yup.string().required(),
    descriptionField: Yup.string(),
    subjectField: Yup.string(),
    existingDeckField: Yup.mixed(),
    languageField: Yup.mixed(),
    eitherTextOrFileOrUrlError: Yup.string().test(
      "either-text-or-file-or-url",
      "You must provide exactly one input: a file, a link, or some text to process",
      function (value) {
        const { textField, fileField, linkField } = this.parent;
        const filledInputs = [textField, fileField, linkField].filter(Boolean);
        return filledInputs.length === 1;
      }
    ),
    eitherNameOrExistingDeckError: Yup.string().test(
      "either-name-or-existing-deck",
      "Please either provide a name for a new deck or choose an existing deck",
      function (value) {
        const { nameField, existingDeckField } = this.parent;
        return !!(nameField || existingDeckField);
      }
    ),
  })
  .test(
    "either-text-or-file-or-url",
    "You must provide exactly one input: a file, a link, or some text to process",
    (value) => {
      const inputs = [value.textField, value.fileField, value.linkField];
      const filledInputs = inputs.filter(Boolean);
      console.log("filledInputs", filledInputs);
      return filledInputs.length === 1;
    }
  )
  .test(
    "either-name-or-existing-deck",
    "Please either provide a name for a new deck or choose an existing deck",
    (value) => {
      return !!(value.nameField || value.existingDeckField);
    }
  );

export { validationSchema };
