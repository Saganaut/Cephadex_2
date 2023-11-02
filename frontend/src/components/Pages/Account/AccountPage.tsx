import UserAvatar from "@assets/UserAvatar.svg";
import { validationSchema } from "@pages/Account/AccountFormValidation";
import { Dropdown } from "@pages/Account/Dropdown";
import { InputErrorMessage } from "@pages/Account/InputErrorMessage";
import { InputField } from "@pages/Account/InputField";
import { Plans } from "@pages/Account/Plans";
import { PreferencesSelect } from "@pages/Account/PreferencesSelect";
import { Form, Formik } from "formik";
import React, { type ReactElement } from "react";

const roles: Array<{ value: number; label: string }> = [
  { value: 0, label: "None" },
  { value: 1, label: "Student" },
  { value: 2, label: "Teacher" },
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
function AccountPage(): ReactElement {
  return (
    <div>
      {/*   Content */}
      <div className={"w-full pl-[60px] pt-[200px]  "}>
        <h1 className={"text-[24px] font-semibold text-blaze-orange"}>
          Account Information
        </h1>
        <img src={UserAvatar} alt="avatar" className={"pb-[48px] pt-[24px] "} />

        {/*   Form */}
        <Formik
          initialValues={{
            nameField: "",
            emailField: "",
            usernameField: "",
          }}
          validationSchema={validationSchema}
          validateOnBlur={true}
          onSubmit={(values) => {
            console.log("submit ----------------------------------");
            console.log(values);
          }}
        >
          {(formik) => (
            <Form>
              <div className={"flex flex-col gap-y-[34px]"}>
                <div>
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
                <div>
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
                <div>
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

                <div>
                  <Dropdown label={"Gender"} options={genders} />
                </div>
                <div>
                  <Dropdown label={"Role"} options={roles} />
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
export default AccountPage;
