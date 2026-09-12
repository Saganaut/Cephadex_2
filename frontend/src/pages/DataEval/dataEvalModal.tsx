import CloseIcon from "@assets/CloseIcon.svg?react";
import { type LlmRecordsSchema } from "@source/client";
import { ModalWrapper } from "@source/common/Modals/ModalWrapper";
import React from "react";

interface DataEvalModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  prompt: LlmRecordsSchema;
}
const DataEvalModal: React.FC<DataEvalModalProps> = ({
  isOpen,
  setIsOpen,
  prompt,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className=" rounded-xl bg-mariana-blue p-4 px-8">
        <CloseIcon
          onClick={() => {
            setIsOpen(false);
          }}
          className="absolute right-4 top-4 h-6 w-6 cursor-pointer hover:scale-105"
          fill="#FF6E0B"
        />
        <div>
          <div className="rounded-xl bg-white p-1">
            <h4 className="">
              Type:{prompt.type} - Subtype: {prompt.subtype}{" "}
            </h4>
          </div>
          <div className="my-1 rounded-xl  bg-white p-1">
            <h5 className="font-bold">Prompt:</h5>

            <p>{prompt.prompt}</p>
          </div>
          <div className="my-1 rounded-xl bg-white p-1">
            <h5 className="font-bold">Response:</h5>
            <p>{prompt.response}</p>
          </div>
          <div className="my-1 rounded-xl  bg-white p-1">
            <p>Temp: {prompt.temperature}</p>
            <p>Model: {prompt.model}</p>
            <p>Version: {prompt.version}</p>
            <p>Res format: {prompt.response_format}</p>
            <p>sys_instruct: {prompt.sys_instruct}</p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export { DataEvalModal };
