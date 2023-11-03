import React from "react";
import { Dropdown } from "@common/Form/Dropdown";

const detail: Array<{ value: number; label: string }> = [
  { value: -1, label: "" },
  { value: 0, label: "Low" },
  { value: 1, label: "Medium" },
  { value: 2, label: "High" },
];

interface DetailSelectorProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

const DetailSelector: React.FC<DetailSelectorProps> = () => {
  return (
    <div className=" w-full max-w-sm">
      <Dropdown label="Detail" options={detail} />
    </div>
  );
};
export { DetailSelector };
