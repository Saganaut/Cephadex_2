import type { UserSettingsSchema } from "@source/client";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import React from "react";
import { useForm } from "react-hook-form";

interface StudySettingsProps {
  settings: UserSettingsSchema;
}

const StudySettings: React.FC<StudySettingsProps> = ({ settings }) => {
  return {
    /* Add more sliders as needed for your study settings */
  };
};

export { StudySettings };
