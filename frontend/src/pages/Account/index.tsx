// import { useUser } from "@contexts/UserContext";
import { validationSchema } from "@account/AccountFormValidation";
import { Plans } from "@account/Plans";
import UserAvatar from "@assets/UserAvatar.svg";
import { Dropdown } from "@common/Form/Dropdown";
import { InputErrorMessage } from "@common/Form/InputErrorMessage";
import { InputField } from "@common/Form/InputField";
import { PreferencesSelect } from "@common/Form/PreferencesSelect";
import { logger } from "@utils/Logger";
import { Form, Formik } from "formik";
import React, { type ReactElement } from "react";
import { useSelector } from "react-redux";

const roles: Array<{ value: number; label: string }> = [
  { value: 0, label: "None" },
  { value: 1, label: "Student" },
  { value: 2, label: "Teacher" },
  { value: 3, label: "Other" },
];
const genders: Array<{ value: number; label: string }> = [
  { value: 0, label: "None" },
  { value: 1, label: "Male" },
  { value: 2, label: "Female" },
  { value: 3, label: "Other" },
];

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Important",
    value: "important",
  },
  {
    label: "None",
    value: "none",
  },
];
function Account(): ReactElement {
  const user = useSelector((state) => state.user.user);
  if (user == null) return <div>loading...</div>;

  return (
    <div>
      {/*   Content */}
      <div className={"w-full"}>
        <h1 className={"text-[24px] font-semibold text-blaze-orange"}>
          Account Information
        </h1>
        <img src={UserAvatar} alt="avatar" className={"pb-[48px] pt-[24px] "} />

        {/*   Form */}
        <Formik
          initialValues={{
            nameField: user["first-name"] ?? "",
            emailField: user.email ?? "",
            usernameField: user.username ?? "",
            roleField: user.gender ?? "",
            genderField: user.gender ?? "",
          }}
          validationSchema={validationSchema}
          validateOnBlur={true}
          onSubmit={(values) => {
            logger.log("Submitting Account Page Values:", values);
          }}
        >
          {(formik) => (
            <Form>
              <div className={"flex flex-col gap-y-[34px]"}>
                <div className={"max-w-[50%]"}>
                  <InputField
                    label={"Name"}
                    onBlur={formik.handleBlur}
                    type={"text"}
                    name={"nameField"}
                    onChange={formik.handleChange}
                    value={formik.values.nameField}
                    placeholder={"Your Name"}
                  />
                  <InputErrorMessage
                    error={formik.errors.nameField != null}
                    errorMessage={"Error On Name Field"}
                  />
                </div>
                <div className={"max-w-[50%]"}>
                  <InputField
                    label={"Email"}
                    onBlur={formik.handleBlur}
                    type={"email"}
                    name={"emailField"}
                    onChange={formik.handleChange}
                    value={formik.values.emailField}
                    placeholder={"Your Email"}
                  />
                  <InputErrorMessage
                    error={formik.errors.emailField != null}
                    errorMessage={"Error On Email Field"}
                  />
                </div>
                <div className={"max-w-[50%]"}>
                  <InputField
                    label={"Username"}
                    onBlur={formik.handleBlur}
                    type={"text"}
                    name={"usernameField"}
                    onChange={formik.handleChange}
                    value={formik.values.usernameField}
                    placeholder={"Your username"}
                  />
                  <InputErrorMessage
                    error={formik.errors.usernameField != null}
                    errorMessage={"Error On username Field"}
                  />
                </div>

                <div className={"max-w-[650px]"}>
                  <Dropdown
                    style={"select"}
                    name={"genderField"}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.genderField}
                    label={"Gender"}
                    options={genders}
                  />
                </div>
                <div className={"max-w-[650px]"}>
                  <Dropdown
                    style={"select"}
                    name={"roleField"}
                    value={formik.values.roleField}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label={"Role"}
                    options={roles}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <Plans />
        <PreferencesSelect label={"Email preferences"} options={options} />
        <PreferencesSelect
          label={"Sign up to our mailing list"}
          options={options}
        />
      </div>
    </div>
  );
}
export default Account;
