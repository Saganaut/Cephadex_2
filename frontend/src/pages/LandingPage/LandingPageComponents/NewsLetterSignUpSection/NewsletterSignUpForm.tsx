import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import axios from "axios";

const SubmitButton = ({ isDisabled }) => {
  return (
    <button
      type="submit"
      className={`
            p-2 rounded-full text-white bg-electric-violet border-2 
            cursor-pointer transform transition-transform 
            ${
              isDisabled
                ? "bg-electric-violet-100 cursor-not-allowed shadow-none"
                : ""
            }
        `}
    >
      Submit
    </button>
  );
};

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

const Input = React.memo(({ value, onChange, onBlur }) => {
  return (
    <>
      <input
        id="email"
        name="email"
        type="email"
        className={`p-2 outline-none focus:outline-none focus:bg-white flex flex-grow `}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        autoComplete="email"
      />
    </>
  );
});

const NewsletterSignUpForm = () => {
  const [subscribeInfo, setSubscribeInfo] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: (values) => {
      Subscribe(values.email, setSubscribeInfo);
    },
  });

  const Subscribe = useCallback(async (email) => {
    const endpoint = `${process.env.REACT_APP_BACKEND_URL}/user_bp/api_0/subscribe`;
    try {
      const response = await axios.post(
        endpoint,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSubscribeInfo(response.data.message);
    } catch (error) {
      setSubscribeInfo("An error occurred! Please try again.");
    }
  }, []);

  const handleSubmit = useCallback(
    (values) => {
      alert(JSON.stringify(values, null, 2));
      Subscribe(values.email);
    },
    [Subscribe]
  ); // handleSubscribe is a dependency here

  formik.onSubmit = handleSubmit;

  const disabled =
    !formik.values.email || !formik.touched.email || formik.errors.email;

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className=" bg-white border rounded-full w-full max-w-lg flex items-center justify-between p-1 overflow-hidden">
          <Input
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <SubmitButton isDisabled={disabled} />
        </div>
        <div className="p-2 items-start flex text-small text-blaze-orange">
          {subscribeInfo}
        </div>
        {formik.touched.email && formik.errors.email ? (
          <div className="p-2 items-start flex text-small text-blaze-orange">
            {formik.errors.email}
          </div>
        ) : null}
      </form>
    </div>
  );
};

export { NewsletterSignUpForm };
