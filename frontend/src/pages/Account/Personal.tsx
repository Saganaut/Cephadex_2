import { Switch } from "@headlessui/react";
import { type UserSchema, type UserUpdateRequest } from "@source/client";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { CardAvatar } from "@source/common/Cards/CardProfile/CardAvatar";
import { CustomErrorMessage } from "@source/common/Form/CustomErrorMessage";
import { Dropdown } from "@source/common/Form/Dropdown";
import { InputField } from "@source/common/Form/InputField";
import { SwitchField } from "@source/common/Form/SwitchField";
import { useAccount } from "@source/lib/hooks/userHooks/useAccount";
import { Form, Formik, type FormikProps } from "formik";
import React from "react";

import { validationSchema } from "./data/AccountFormValidation";
import { roles } from "./data/AccountFormValues";

interface PersonalProps {
  user: UserSchema;
}
const Personal: React.FC<PersonalProps> = ({ user }) => {
  const {
    subscribeNewsletter,
    unsubscribNewsletter,
    enableEmailNotifs,
    disableEmailNotifs,
    updateUserAccount,
  } = useAccount();

  const toggleContacted = (): void => {
    if (user.contactedEmail === true) {
      void disableEmailNotifs();
    } else {
      void enableEmailNotifs();
    }
  };

  const toggleSubscriber = (): void => {
    if (user.subscriber === true) {
      void unsubscribNewsletter(user.email)();
    } else {
      void subscribeNewsletter(user.email)();
    }
  };

  const handleRoleChange =
    (
      formik: FormikProps<{
        firstName: string;
        lastName: string;
        emailField: string;
        username: string;
        role: string;
      }>
    ) =>
    (selectedRole: { value: number; label: string }): void => {
      void formik.setFieldValue("role", selectedRole.label);
    };

  const getSelectedRole = (role: string): { value: number; label: string } => {
    const selectedRole = roles.find((roles) => roles.label === role) ?? {
      value: 0,
      label: "None",
    };

    return selectedRole;
  };
  // TODO add username back in with check username debounce
  return (
    <>
      {" "}
      <Formik
        initialValues={{
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          emailField: user.email ?? "",
          username: user.username ?? "",
          role: user.role ?? "",
        }}
        validationSchema={validationSchema(user)}
        validateOnBlur={true}
        onSubmit={(values) => {
          const payload: UserUpdateRequest = {
            body: {
              ...values,
            },
          };
          void updateUserAccount(payload);
        }}
      >
        {(formik) => (
          <Form>
            <div></div>
            <div className={"flex flex-col gap-y-[8px]"}>
              <div className="flex py-4 sm:h-full sm:w-full ">
                <CardAvatar pic={user.pic} />
              </div>
              <div className={"max-w-[450px]"}>
                <InputField
                  label={"First Name"}
                  onBlur={formik.handleBlur}
                  type={"text"}
                  name={"firstName"}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  placeholder={"First Name"}
                />
                <CustomErrorMessage name="firstName" />
              </div>
              <div className={"max-w-[450px]"}>
                <InputField
                  label={"Last Name"}
                  onBlur={formik.handleBlur}
                  type={"text"}
                  name={"lastName"}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  placeholder={"Last Name"}
                />
                <CustomErrorMessage name="lastName" />
              </div>

              <div className={"max-w-[450px]"}>
                <InputField
                  label={"Email"}
                  onBlur={formik.handleBlur}
                  type={"email"}
                  name={"emailField"}
                  onChange={formik.handleChange}
                  value={formik.values.emailField}
                  placeholder={"Your Email"}
                />
                <CustomErrorMessage name="emailField" />
              </div>

              {/* <div className={"max-w-[450px]"}>
                <InputField
                  label={"Username"}
                  onBlur={formik.handleBlur}
                  type={"text"}
                  name={"username"}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder={"Your username"}
                />
                <CustomErrorMessage name="username" />
              </div> */}

              <div className={"max-w-[450px]"}>
                <Dropdown
                  style={"select"}
                  name={"role"}
                  value={getSelectedRole(formik.values.role)}
                  onChange={handleRoleChange(formik)}
                  label={"Role"}
                  options={roles}
                />
                <CustomErrorMessage name="role" />
              </div>
              <div className="flex max-w-[400px] items-center justify-between py-4 text-2xl text-tolopea dark:text-aquamarine-100">
                <Switch.Group>
                  <Switch.Label className="mr-4 text-sm md:text-lg">
                    Agree to be contacted by email
                  </Switch.Label>

                  <SwitchField
                    enabled={(user.contactedEmail ?? false) || false}
                    setEnabled={toggleContacted}
                  />
                </Switch.Group>
              </div>
              <div className="flex max-w-[400px] items-center justify-between  py-4 text-2xl text-tolopea dark:text-aquamarine-100">
                <Switch.Group>
                  <Switch.Label className="mr-4 text-sm md:text-lg">
                    Stay up to date with our newsletter
                  </Switch.Label>
                  <SwitchField
                    enabled={user.subscriber ?? (false || false)}
                    setEnabled={toggleSubscriber}
                  />
                </Switch.Group>
              </div>
              <div className="justify-end">
                <StyledButton type="submit" label="Save" onClick={() => {}} />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export { Personal };
