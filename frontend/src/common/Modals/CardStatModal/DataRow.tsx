import React from "react";

interface DataRowProps {
  label: string;
  data?: string | number;
}
const DataRow: React.FC<DataRowProps> = ({ label, data }) => {
  return (
    <div className="flex items-center justify-between  gap-4 whitespace-nowrap">
      <p className="text-bold">{label}: </p>
      <p className="dark:text-blaze-orange text-tolopea">{data}</p>
    </div>
  );
};

export { DataRow };

const ContentRow: React.FC<DataRowProps> = ({ label, data }) => {
  return (
    <div className="flex justify-start gap-4 ">
      <p className="text-bold text-tolopea dark:text-white">{label}: </p>
      <p className="dark:text-blaze-orange  text-tolopea">{data}</p>
    </div>
  );
};

export { ContentRow };
