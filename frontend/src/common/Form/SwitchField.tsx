import { Switch } from "@headlessui/react";
import React, { type ReactElement } from "react";

interface SwitchFieldProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

const SwitchField = ({
  enabled,
  setEnabled,
}: SwitchFieldProps): ReactElement => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled
          ? " bg-blaze-orange transition"
          : "dark:bg-gray-200 bg-electric-violet-200"
      } relative inline-flex h-6 w-11 min-w-min items-center rounded-full`}
    >
      <span
        className={`${
          enabled
            ? "translate-x-6 bg-electric-violet  "
            : "translate-x-1 bg-gray-500"
        } inline-block h-4 w-4 rounded-full`}
      />
    </Switch>
  );
};

export { SwitchField };
