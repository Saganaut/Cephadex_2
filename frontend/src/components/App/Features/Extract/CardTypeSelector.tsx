import React from "react";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CardTypeOption } from "@app/Features/Extract/CardTypeOption";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

type CardType =
  | "Mix"
  | "Definitions"
  | "Fill in the blanks"
  | "Multiple choice"
  | "Translate"
  | "Formulas"
  | "Theories"
  | "Rhyme"
  | "Vocabulary builder"
  | "Explain"
  | "Discuss"
  | "Transcribe"
  | "Summarize"
  | "Turn to notes "
  | "Custom";

const CardTypeSelector = () => {
  let [card, setCard] = useState<CardType>("Mix");

  const [showExpanded, setShowExpanded] = useState(false);

  return (
    <>
      <div className="rounded-3xl min-h-full bg-mariana-blue h-auto p-4">
        <RadioGroup value={card} onChange={(value: CardType) => setCard(value)}>
          <RadioGroup.Label>
            {" "}
            <div className="flex justify-center p-2 pb-4">
              <div className=" text-aquamarine">
                Select one option from the list below
              </div>
            </div>
          </RadioGroup.Label>
          <div className="grid lg:grid-cols-4  w-full md:grid-cols-2 sm:grid-cols-1 gap-0">
            <div className="rounded-full w-full px-2 ">
              <CardTypeOption name="Mix" />
            </div>

            <div className=" w-full   rounded-full px-2  ">
              <CardTypeOption name="Definitions" />
            </div>

            <div className=" w-full  rounded-full px-2 ">
              <CardTypeOption name="Fill in the blanks" />
            </div>

            <div className="rounded-full px-2 ">
              <CardTypeOption name="Multiple choice" />
            </div>

            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Translate" />
            </div>

            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Formulas" />
            </div>
            <div>
              <div
                className={`${
                  showExpanded ? "" : "hidden"
                } rounded-full px-2  expanded`}
              >
                <CardTypeOption name="Theories" />
              </div>
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Rhyme" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Comprehension" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Vocab builder" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Explain" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Discuss" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Transcribe" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Summarize" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Turn to notes" />
            </div>
            <div
              className={`${
                showExpanded ? "" : "hidden"
              } rounded-full px-2  expanded`}
            >
              <CardTypeOption name="Custom" />
            </div>
          </div>
        </RadioGroup>
      </div>{" "}
      <div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowExpanded((prev) => !prev)}
          >
            {showExpanded ? (
              <ChevronUpIcon
                className="h-[46px] w-[65px] text-aquamarine"
                aria-hidden="true"
              />
            ) : (
              <ChevronDownIcon
                className="h-[46px] w-[65px] text-aquamarine"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export { CardTypeSelector };
