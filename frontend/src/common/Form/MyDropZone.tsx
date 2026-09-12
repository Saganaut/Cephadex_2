import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface MyDropZoneProps {
  onFileDrop: (acceptedFiles: File[]) => void;
  style?: object;
  activeMessage?: string;
  defaultMessage?: string;
}

const MyDropZone: React.FC<MyDropZoneProps> = ({
  onFileDrop,
  style,
  activeMessage = "Drag and drop here",
  defaultMessage = "Click to browse or drag and drop your CSV files.",
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileDrop(acceptedFiles);
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={style} className="sm:py-[114px]">
      <input {...getInputProps()} />
      <p className={"mx-auto max-w-[200px] sm:max-w-[300px]"}>
        {isDragActive ? activeMessage : defaultMessage}
      </p>
    </div>
  );
};

export { MyDropZone };
