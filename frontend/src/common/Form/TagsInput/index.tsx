import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface TagsInputProps {
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tags: string[];
}

const isValidEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

const TagsInput: React.FC<TagsInputProps> = ({ setTags, tags }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // If a user did not press enter key or backspace key, return
    if (e.key !== "Enter" && e.key !== "Backspace" && e.key !== ",") return;

    // If the user pressed the backspace key and the input is empty
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      // Remove the last tag from the tags array
      e.preventDefault();

      setTags(tags.slice(0, -1));
      return;
    }
    // Get the value of the input
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const values = e.currentTarget.value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
      const value = values[0];
      // If the value is empty, return
      if (value === "") return;
      // Add the value to the tags array
      if (value === undefined) return;
      if (isValidEmail(value.replace(/,$/, ""))) {
        setTags([...tags, value.replace(/,$/, "")]);
        e.currentTarget.value = ""; // Clear the input
        setError(null);
      } else {
        setError("Please enter a valid email address.");
      }
    }
  };
  const removeTag = (index: number): void => {
    setTags(tags.filter((el, i) => i !== index));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value.trim();
    if (value !== "") {
      setTags([...tags, value]);
      e.currentTarget.value = "";
    }
  };

  return (
    <>
      <div
        className="mx-auto flex w-fit  flex-wrap items-center gap-[10px]  rounded-[40px] border-2 border-solid border-tolopea px-[24px] py-[8px] dark:border-white
"
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-x-[10px] rounded-[20px] bg-mariana-blue px-[10px] py-[4px]"
          >
            <div
              onClick={() => {
                removeTag(index);
              }}
              className={
                "flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-white"
              }
            >
              <XMarkIcon className={"h-[14px] w-[14px] text-tolopea"} />
            </div>
            <span className="font-medium text-white">{tag}</span>
          </div>
        ))}
        <input
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          type="text"
          className=" grow border-[none] bg-transparent px-[8px] py-[4px] outline-none placeholder:text-slate-500 placeholder:dark:text-white"
          placeholder="Enter an email..."
        />
      </div>
      <p className="h-6 p-1 text-xs text-red-500">{error}</p>
    </>
  );
};
export { TagsInput };
