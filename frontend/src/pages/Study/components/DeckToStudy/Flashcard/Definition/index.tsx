import { Button } from "@common/Form/Buttons/Button";
import { CheckIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface DefinitionProps {
  card: any;
  handleDefinitionCardUpdate: (gotIt: boolean) => void;

  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const Definition: React.FC<DefinitionProps> = ({
  setShow,
  show,
  handleDefinitionCardUpdate,
  card,
}) => {
  return (
    <div className={"flex w-full justify-center"}>
      {!show ? (
        <div
          className={
            "inline-flex flex-col items-center justify-center gap-y-[28px]"
          }
        >
          <Button
            className={"bg-mariana-blue"}
            label={"Show answer"}
            onClick={() => {
              setShow(true);
            }}
          />
          <div className={"flex  w-full justify-between gap-x-[20px]"}>
            <button
              onClick={() => {
                setShow(true);
                handleDefinitionCardUpdate(false);
              }}
              className={
                "flex w-full items-center justify-between rounded-full border-2 border-aquamarine px-4 py-[4px] text-[18px]"
              }
            >
              <span>Lost it</span>

              <XMarkIcon className={"h-[24px] w-[24px] text-aquamarine"} />
            </button>
            <button
              onClick={() => {
                setShow(true);
                handleDefinitionCardUpdate(true);
              }}
              className={
                "flex w-full items-center justify-between rounded-full border-2 border-aquamarine bg-aquamarine px-4 py-[4px] text-[18px] text-mariana-blue"
              }
            >
              <span>Got it</span>

              <CheckIcon className={"h-[20px] w-[20px] text-mariana-blue"} />
            </button>
          </div>
        </div>
      ) : (
        <p>{card.content}</p>
      )}
    </div>
  );
};
export { Definition };
