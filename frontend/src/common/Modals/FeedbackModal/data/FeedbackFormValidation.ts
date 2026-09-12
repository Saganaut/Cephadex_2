import * as Yup from "yup";

const FeedbackFormValidation = Yup.object().shape({
  nameField: Yup.string()
    .max(50, "Name must be at most 50 characters")
    .required("Please enter your name"),
  emailField: Yup.string()
    .email("Please enter a valid email address")
    .max(120, "Email must be at most 120 characters")
    .required("Please enter your email address"),
  messageField: Yup.string()
    .max(500, "Message must be at most 500 characters")
    .required("Please enter your message"),
  feedbackTypeField: Yup.string()
    .max(50, "Feedback type must be at most 50 characters")
    .required("Please select a feedback type"),
});

export { FeedbackFormValidation };
