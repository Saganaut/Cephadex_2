import CloseIcon from "@assets/CloseIcon.svg?react";
import React from "react";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}

interface selectedItemsProps {
  selectedItems: LookedUpItem[];
  removeSelectedItem: (item: LookedUpItem) => void;
  type: string;
  removeSelectedEmail?: (email: string) => void;
  selectedEmails?: Array<{ email: string }>;
}
const SelectedItems: React.FC<selectedItemsProps> = ({
  selectedItems,
  removeSelectedItem,
  selectedEmails,
  removeSelectedEmail,
  type,
}) => {
  return (
    <div
      className={
        "mt-[24px] flex min-w-[240px] flex-wrap items-start gap-[8px] text-white"
      }
    >
      {selectedItems.map((item: LookedUpItem) => (
        <div
          className="flex w-fit items-center gap-x-[8px] rounded-full bg-mariana-blue-100 px-[16px] py-[4px]"
          key={item.id}
        >
          {type === "user" && (
            <span>
              {item.username} - {item.email}
            </span>
          )}
          {(type === "deck" || type === "copyCard") && (
            <span>
              {item.name} {item.subject != null ? `- ${item.subject}` : ""}
            </span>
          )}

          <CloseIcon
            className="h-[12px] w-[12px] cursor-pointer fill-gray-300 hover:scale-105 hover:fill-white"
            onClick={() => {
              removeSelectedItem(item);
            }}
          />
        </div>
      ))}
      {selectedEmails != null &&
        selectedEmails.length > 0 &&
        selectedEmails.map((email: { email: string }) => (
          <li className="flex justify-between" key={email.email}>
            <span>{email.email}</span>
            <CloseIcon
              className="cursor-pointer hover:scale-105"
              onClick={() =>
                removeSelectedEmail != null && removeSelectedEmail(email.email)
              }
            />
          </li>
        ))}
    </div>
  );
};

export { SelectedItems };
