import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  nameField: Yup.string().required(),
  emailField: Yup.string().email("Invalid email address").required(),
  usernameField: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required(),
});
export { validationSchema };
