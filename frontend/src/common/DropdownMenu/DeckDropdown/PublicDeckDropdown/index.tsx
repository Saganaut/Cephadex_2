// import { getBasicLinks, getGroupLinks, getPublicLinks } from "./data/links";
import DownloadIcon from "@assets/cardMenuIcons/DownloadIcon.svg?react";
import SaveIcon from "@assets/SaveChestIcon.svg?react";
import { DropdownMenu } from "@source/common/DropdownMenu";
import { EllipsisMenuButton } from "@source/common/DropdownMenu/components/EllipsisMenuButton";
import { useDownloadDeckCsv } from "@source/lib/hooks/deckHooks/useDownloadDeckCsv";
import { useSavePublicDeck } from "@source/lib/hooks/deckHooks/useSavePublicDeck";
import React from "react";

interface PublicDeckDropdownProps {
  deckId: number;
  type: "public";
}

const PublicDeckDropdown: React.FC<PublicDeckDropdownProps> = ({
  deckId,
  type,
}) => {
  const savePublicDeck = useSavePublicDeck();
  const downloadDeckCsv = useDownloadDeckCsv();

  const links = [
    {
      label: "Save",
      icon: SaveIcon,
      type: "",
      onClick: async () => await savePublicDeck(deckId),
    },
    // {
    //   label: "View",
    //   icon: StudyIcon,
    //   type: "",
    //   onClick: () => {},
    // },
    {
      label: "Download",
      icon: DownloadIcon,
      type: "",
      onClick: async () => {
        await downloadDeckCsv(deckId);
      },
    },
  ];

  return (
    <>
      {" "}
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DropdownMenu
          type="Deck"
          button={<EllipsisMenuButton />}
          links={links}
        />
      </div>
    </>
  );
};

export { PublicDeckDropdown };

// // Here we finish constructing the links adding in the groupId, deckId and boolean.
