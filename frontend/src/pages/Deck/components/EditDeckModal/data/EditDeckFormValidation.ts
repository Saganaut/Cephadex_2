import * as Yup from "yup";

// name - 50 max
// description - 255 max
// category - 50 max
// subjet - 50 max
// topc - 50 max
// img - 255 max
// public - bool (but tiny int)
// tags - 255 max
// fav - bool (but tiny int)

// DECK ATTRIBUTES
// subject 50 max
// grade 50 max
// topic 100 max
// difficult 50 max
// concepts 200 max
// langguage 50 max

// ADD REMOVE PARENT/CHILD DECK
const MAX_FILE_SIZE = 1; // 1MB
// const MAX_WIDTH = 500;
// const MAX_HEIGHT = 500;
const EditDeckFormValidation = Yup.object().shape({
  name: Yup.string()
    .min(5, "Name must be between 5 and 50 characters long.")
    .max(50, "Name must be between 5 and 50 characters long.")
    .required("Please choose a deck name"),
  description: Yup.string()
    .min(0, "Description must be between 5 and 255 characters long.")
    .max(255, "Description must be between 5 and 255 characters long."),
  category: Yup.string()
    .min(0, "Category must be between 5 and 50 characters long.")
    .max(50, "Category must be between 5 and 50 characters long."),
  subject: Yup.string()
    .min(0, "Subject must be between 5 and 50 characters long.")
    .max(50, "Subject must be between 5 and 50 characters long."),
  topic: Yup.string()
    .min(0, "Topic must be between 5 and 50 characters long.")
    .max(50, "Topic must be between 5 and 50 characters long."),
  difficulty: Yup.string()
    .min(0, "Difficulty must be between 5 and 50 characters long.")
    .max(50, "Difficulty must be between 5 and 50 characters long."),
  public: Yup.boolean(),
  tags: Yup.string()
    .min(0, "Tags must be between 5 and 255 characters long.")
    .max(255, "Tags must be between 5 and 255 characters long."),
  fav: Yup.boolean(),
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
  // .test(
  //   "fileResolution",
  //   "Resolution too high, please upload a file with a resolution of 500*500 or less",
  //   (value) =>
  //     new Promise((resolve, reject) => {
  //       const img = new Image();
  //       img.onload = () =>
  //         resolve(img.width <= MAX_WIDTH && img.height <= MAX_HEIGHT);
  //       img.onerror = reject;
  //       img.src = URL.createObjectURL(value as File);
  //     })
  // ),
});

export { EditDeckFormValidation };
