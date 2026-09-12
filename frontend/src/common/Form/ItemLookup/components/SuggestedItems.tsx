import React from "react";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}
interface SuggestedItemsProps {
  suggestions: LookedUpItem[];
  handleSelectItem: (user: LookedUpItem) => void;
  activeSuggestion: number;
  type: string;
}
const SuggestedItems: React.FC<SuggestedItemsProps> = ({
  suggestions,
  handleSelectItem,
  activeSuggestion,
  type,
}) => {
  return (
    <>
      {suggestions.length > 0 && (
        <ul className="absolute z-50 min-w-[250px] overflow-hidden rounded-lg py-2 text-white">
          {suggestions.map((item: LookedUpItem, index: number) => (
            <li
              className={`cursor-pointer px-[10px] py-[4px] hover:bg-blaze-orange ${
                activeSuggestion === index
                  ? "bg-electric-violet-200"
                  : "bg-white text-black  "
              } ${index === 0 ? "rounded-t-lg" : ""} ${
                index === suggestions?.length - 1 ? "rounded-b-lg" : ""
              }`}
              key={item.id}
              onClick={() => {
                handleSelectItem(item);
              }}
            >
              {type === "user" && <span>{item.username}</span>}
              {(type === "deck" || type === "copyCard") && (
                <span>
                  {item.name}{" "}
                  {item.subject?.length > 0 ? `- ${item.subject}` : ""}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export { SuggestedItems };
