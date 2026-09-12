import { Socials } from "@source/common/Sharing/Socials";
import React from "react";

interface ShareTabProps {
  itemId: number;
  type: "quiz" | "deck";
  link: string;
}
const ShareTab: React.FC<ShareTabProps> = ({ itemId, type, link }) => {
  return (
    <div>
      <Socials link={link} />
    </div>
  );
};
export { ShareTab };
