import { Dropdown } from "@common/Form/Dropdown";
import { InputField } from "@common/Form/InputField";
// import { DevTool } from "@hookform/devtools";
import { Button } from "@source/common/Buttons/Button";
import { useDebouncedEffect } from "@source/lib/hooks/useDebouncedEffect";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { setFieldValue } from "@source/lib/store/register/registerSlice";
import { checkUsername } from "@source/lib/utils/functions";
import React, { type ReactElement } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import { ErrorMessage } from "../ErrorMessage";
import roles from "./data/roles";

interface RegisterStepTwoProps {
  notRegisteredMessage: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSpeech: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterStepTwo: React.FC<RegisterStepTwoProps> = ({
  notRegisteredMessage,
  setStep,
  setSpeech,
}): ReactElement => {
  const registerState = useAppSelector((state) => state.registration);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,

    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      mode: "onChange",
      reValidateMode: "onChange",
      shouldFocusError: true,
      username: registerState.username ?? "",
      role: { value: undefined, label: registerState.role ?? "" },
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<any> = (data) => {
    // Dispatch your actions here
    dispatch(setFieldValue({ field: "username", value: data.username }));
    dispatch(setFieldValue({ field: "role", value: data.role.label }));
    setStep(3);
  };
  const onErrors: SubmitErrorHandler<any> = (errors) => {};
  const onClick = async (): Promise<void> => {
    const isValid = await trigger(); // Trigger validation for all fields

    if (isValid) {
      void handleSubmit(async (data) => {
        const isAvailable = await checkUsername(username);

        if (!isAvailable) {
          setError("username", {
            type: "manual",
            message: "Username is already taken",
          });
        } else {
          clearErrors("username");
          onSubmit(data);
        }
      }, onErrors)();
    }
  };
  const username = watch("username");
  watch("role");
  useDebouncedEffect(
    () => {
      if (username != null && username.length >= 3) {
        void checkUsername(username).then((isAvailable) => {
          if (!isAvailable) {
            setError("username", {
              type: "manual",
              message: "Username is already taken",
            });
          } else {
            clearErrors("username");
          }
        });
      }
    },
    [username],
    1000
  );
  const usernameField = register("username", {
    required: "Please choose a username",
    maxLength: { value: 20, message: "Username must be 20 characters or less" },
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters long",
    },
    pattern: {
      value: /^[a-zA-Z0-9_-]+$/,
      message:
        "Username can only contain letters, numbers, underscores, and hyphens",
    },
  });
  const roleField = register("role", { required: "Please choose a role" });

  const handleRoleChange = (value: { value: number; label: string }): void => {
    void roleField.onChange({
      target: { value, name: "role" },
    } as any);
    setTimeout(() => {
      clearErrors("role");
    }, 1);
  };
  if (notRegisteredMessage) {
    setSpeech(
      "    Oops! Looks like you haven't registered yet. It only takes a minute."
    );
  } else {
    setSpeech(" Let's get to know you better.");
  }
  return (
    <div className="h-full w-full p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4">
          <div className="flex justify-center py-2 text-2xl text-aquamarine-100">
            How should we refer to you?
          </div>

          <InputField
            name={usernameField.name}
            onChange={usernameField.onChange}
            onBlur={usernameField.onBlur}
            inputFieldRef={usernameField.ref}
            placeholder="eg. DeepLearner123"
            type="text"
            value={getValues("username")}
            textStyle="text-white"
          />

          <ErrorMessage message={errors?.username?.message} />
        </div>

        <div className="p-4">
          <div className="flex justify-center py-2 text-2xl text-aquamarine-100">
            How would you describe yourself?
          </div>
          <Dropdown
            options={roles}
            onChange={handleRoleChange}
            name={roleField.name}
            dropdownRef={roleField.ref}
            value={getValues("role")}
            style={"select"}
            textStyle="text-white"
          />
          <ErrorMessage message={errors?.role?.message} />
        </div>
      </form>
      {/* <DevTool control={control} /> */}
      <div className="flex justify-end">
        <Button label="Next" onClick={onClick} />
      </div>
    </div>
  );
};

export { RegisterStepTwo };
