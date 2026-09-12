// import { getBasicLinks, getGroupLinks, getPublicLinks } from "./data/links";
import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import DownloadIcon from "@assets/cardMenuIcons/DownloadIcon.svg?react";
import ShareIcon from "@assets/cardMenuIcons/ShareIcon.svg?react";
import StudyIcon from "@assets/cardMenuIcons/StudyIcon.svg?react";
import { DropdownMenu } from "@source/common/DropdownMenu";
import { EllipsisMenuButton } from "@source/common/DropdownMenu/components/EllipsisMenuButton";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import { useDownloadDeckCsv } from "@source/lib/hooks/deckHooks/useDownloadDeckCsv";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DeckDropdownProps {
  groupId?: number;
  deckId: number;
  type: "group" | "standard" | "simple" | "public" | "groupAdmin" | "full";
}

const DeckDropdown: React.FC<DeckDropdownProps> = ({
  groupId,
  deckId,
  type,
}) => {
  const { setDeckId, setIsDeleteDeckModalOpen, setIsShareDeckModalOpen } =
    useDeckContexts();
  const downloadDeckCsv = useDownloadDeckCsv();
  const navigate = useNavigate();
  const handleDeleteDeck = (): void => {
    setDeckId(deckId);
    setIsDeleteDeckModalOpen(true);
  };

  const handleShareDeck = (): void => {
    setDeckId(deckId);
    setIsShareDeckModalOpen(true);
  };

  const links = [
    // {
    //   label: "View",
    //   icon: StudyIcon,
    //   type: "",
    //   onClick: () => {
    //     navigate(`/deck/${deckId}`);
    //   },
    // },
    {
      label: "Study",
      type: "middle",
      icon: StudyIcon,
      onClick: () => {
        navigate(`/study/deck/${deckId}`);
      },
    },
    {
      label: "Share",
      type: "middle",
      icon: ShareIcon,
      onClick: handleShareDeck,
    },
    {
      label: "Download",
      icon: DownloadIcon,
      type: "",
      onClick: async () => {
        await downloadDeckCsv(deckId);
      },
    },

    {
      label: "Delete",
      type: "middle",
      icon: DeleteIcon,
      onClick: handleDeleteDeck,
    },
  ];

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <DropdownMenu type="Deck" button={<EllipsisMenuButton />} links={links} />
    </div>
  );
};

export { DeckDropdown };
