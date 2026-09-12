import * as Yup from "yup";

const categories: string[] = [
  "Definitions",
  "Multiple choice",
  "Translate",
  "Fill in the blanks",
  "Rhyme",
  "Comprehension",
  "Vocab builder",
  "Custom",
  "Explain",
  "Discuss",
] as const;

const NewCardFormValidation = Yup.object().shape({
  term: Yup.string()
    .max(1000, "Front of card must be at most 1000 characters")
    .required("Please enter something for the front of card"),
  content: Yup.string()
    .max(5000, "Back of card content field must be less than 5000 characters")
    .required("Please enter something for the first content field"),
  boc2: Yup.string()
    .max(
      1000,
      "Please enter at most 1000 characters for the second back of card field"
    )
    .when("category", (category, schema) =>
      category === "Multiple choice"
        ? schema.required("All fields required for  multiple choice questions")
        : schema
    ),
  boc3: Yup.string()
    .max(
      1000,
      "Please enter at most 1000 characters for the third back of card field"
    )
    .when("category", (category, schema) =>
      category === "Multiple choice"
        ? schema.required("All fields  required for multiple choice questions")
        : schema
    ),
  boc4: Yup.string()
    .max(
      1000,
      "Please enter at most 1000 characters for the fourth back of card field"
    )
    .when("category", (category, schema) =>
      category === "Multiple choice"
        ? schema.required("All fields required for multiple choice questions")
        : schema
    ),
  category: Yup.string()
    .oneOf(categories, "Invalid category")
    .required("Category is required"),
});

export { NewCardFormValidation };
