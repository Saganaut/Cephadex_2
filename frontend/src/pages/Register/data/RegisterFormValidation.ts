import { debouncedCheckUsername } from "@source/lib/utils/functions";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Must be at least 3 characters long")
    .max(20, "Must be no more than 20 characters long")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Can only contain letters, numbers, underscores, and dashes"
    )
    .test("username-available", "Username is already taken", async (value) => {
      const isAvailable = await debouncedCheckUsername(value);
      return isAvailable === true;
    }),
  whatDoYouWantToDo: Yup.string()
    .required("Please let us know how you plan to use Cephadex")
    .min(5, "Must be at least 5 characters long")
    .max(20, "Must be no more than 20 characters long")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Can only contain letters, numbers, underscores, and dashes"
    ),
  howDidYouHearAboutUs: Yup.mixed()
    .required("Please select an option")
    .test("is-empty", "This field is required", (value) => value.label !== ""),
  role: Yup.mixed()
    .required("Please select a role")
    .test("is-empty", "Role is required", (value) => value.label !== ""),
  agreeTandC: Yup.boolean().test(
    "is-true",
    "Please agree to the terms and conditions",
    (value) => {
      return value === true;
    }
  ),
});

export { validationSchema };
