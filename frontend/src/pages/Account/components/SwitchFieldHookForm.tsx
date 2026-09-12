import React from "react";
import { SwitchField } from "@common/Form/SwitchField";
import { Switch } from "@headlessui/react";
interface SwitchFieldHookFormProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  label: string;
}
const SwitchFieldHookForm: React.FC<SwitchFieldHookFormProps> = ({
  enabled,
  setEnabled,
  label,
}) => {
  return (
    <>
      {" "}
      <div className=" flex items-center py-4 text-2xl text-white">
        <Switch.Group>
          <Switch.Label className="mr-4 grow">{label}</Switch.Label>
          <div className="min-h-fit">
            <SwitchField enabled={enabled} setEnabled={setEnabled} />
          </div>
        </Switch.Group>
      </div>
    </>
  );
};

export { SwitchFieldHookForm };
