import { type UserSettingsSchema } from "@source/client";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import React from "react";
import { useForm } from "react-hook-form";

interface BasicSettingsProps {
  settings: UserSettingsSchema;
}
const BasicSettings: React.FC<BasicSettingsProps> = () => {
  const { register, handleSubmit } = useForm<UserSettingsSchema>();

  const onSubmit = (data: UserSettingsSchema): void => {
    // Here you'd send the data to your FastAPI backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Add more checkboxes as needed for newUser, newUserStudy, etc. */}

      <StyledButton onClick={() => {}} label="Save" type="submit" />
    </form>
  );
};

export { BasicSettings };
