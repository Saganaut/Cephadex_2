import { type UserSchema } from "@source/client/models/UserSchema";
// import { debouncedCheckUsername } from "@source/lib/utils/functions";
import * as Yup from "yup";

const validationSchema = (user: UserSchema) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be less than 50 characters"),
    lastName: Yup.string()
      .min(2, "Must be at least 2 characters")
      .max(50, "Must be less than 50 characters"),
    emailField: Yup.string().email("Invalid email address").required(),
    username: Yup.string()
      .required("Username is required")
      .matches(
        /^[a-zA-Z0-9_-]{3,20}$/,
        "Username must be 3-20 characters long and can only contain letters, numbers, underscores, and dashes"
      ),
    // .test(
    //   "username-available",
    //   "Username is already taken",
    // async function (value) {
    //   if (value === user.username) {
    //     // Skip validation if username hasn't changed
    //     return true;
    //   }
    // const result = await debouncedCheckUsername(value);
    // return Boolean(result);
    // const isAvailable = await debouncedCheckUsername(value);
    // return isAvailable;
    // }
    // ),
    role: Yup.mixed().required("Please select a role"),
  });
export { validationSchema };
