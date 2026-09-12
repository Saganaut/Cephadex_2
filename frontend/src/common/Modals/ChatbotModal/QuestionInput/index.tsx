import React, { useEffect, useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";

import { type QuestionType } from "..";
import { ChatbotInputField } from "./ChatbotInputField";

const QuestionTypeValues = [
  "question",
  "wrong",
  "explain",
  "cephadex",
  "files",
];

interface QuestionInputProps {
  handleQuestion: (typeArg: QuestionType, question?: string) => Promise<void>;
}
const QuestionInput: React.FC<QuestionInputProps> = ({ handleQuestion }) => {
  const [searchText, setSearchText] = useState("");
  const [displayText, setDisplayText] = useState(""); // New state for adjusted display text
  const [typeQuestion, setTypeQuestion] = useState<
    "question" | "wrong" | "explain" | "cephadex" | "files"
  >("question");
  const [styledText, setStyledText] = useState("");

  useEffect(() => {
    const match = searchText.match(/@(\w+)/);
    if (match != null && QuestionTypeValues.includes(match[1] ?? "")) {
      setStyledText(match[0]);
      setTypeQuestion(match[1] ?? "question");
      const newText = searchText.replace(match[0], "").trim();
      setDisplayText(newText);
    } else {
      setDisplayText(searchText);
    }
  }, [searchText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && searchText.length === 0) {
      const modifiedSearchType = "";
      setStyledText(modifiedSearchType);
      setTypeQuestion("question");
    }
    if (e.key === "Enter") {
      e.preventDefault();
      void handleQuestion({ type: typeQuestion }, searchText);
      setSearchText("");
      setDisplayText("");
      setStyledText("");
      setTypeQuestion("question");
    }
  };

  return (
    <div
      className={
        "absolute bottom-[30px] flex w-[86%] items-center gap-x-[10px]"
      }
    >
      <ChatbotInputField
        className={"bg-tolopea"}
        label={""}
        onBlur={() => {}}
        type={"text"}
        searchType={styledText}
        name={"searchText"}
        onChange={handleChange}
        handleOnKeyDown={handleKeyDown}
        value={displayText}
        placeholder={"Enter your question here..."}
      />
      <div
        onClick={() => {
          void handleQuestion({ type: typeQuestion }, searchText);
          setSearchText("");
          setDisplayText("");
          setStyledText("");
        }}
        className={
          "group flex h-[50px] w-[50px] min-w-[50px] cursor-pointer items-center justify-center rounded-full dark:bg-mariana-blue bg-electric-violet-500"
        }
      >
        <LuSendHorizonal
          className={
            "text-[24px] text-white dark:opacity-30 group-hover:dark:opacity-100 group-hover:text-aquamarine-100"
          }
        />
      </div>
    </div>
  );
};
export { QuestionInput };
