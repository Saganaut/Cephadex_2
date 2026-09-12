// import { getBasicLinks, getGroupLinks, getPublicLinks } from "./data/links";
import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import DownloadIcon from "@assets/cardMenuIcons/DownloadIcon.svg?react";
import ShareIcon from "@assets/cardMenuIcons/ShareIcon.svg?react";
import StudyIcon from "@assets/cardMenuIcons/StudyIcon.svg?react";
import SaveIcon from "@assets/SaveChestIcon.svg?react";
import { DropdownMenu } from "@source/common/DropdownMenu";
import { EllipsisMenuButton } from "@source/common/DropdownMenu/components/EllipsisMenuButton";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import { useDeleteDeckFromGroup } from "@source/lib/hooks/deckHooks/useDeleteDeckFromGroup";
import { useDownloadDeckCsv } from "@source/lib/hooks/deckHooks/useDownloadDeckCsv";
import { useSavePublicDeck } from "@source/lib/hooks/deckHooks/useSavePublicDeck";
import { saveGroupDeck } from "@source/lib/store/decks/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React from "react";

interface GroupDeckDropdownProps {
  groupId: number;
  deckId: number;
  type: "group" | "groupAdmin";
}

const GroupDeckDropdown: React.FC<GroupDeckDropdownProps> = ({
  groupId,
  deckId,
  type,
}) => {
  const dispatch = useAppDispatch();
  const savePublicDeck = useSavePublicDeck();
  const deleteDeckFromGroup = useDeleteDeckFromGroup();
  const { setDeckId, setIsShareDeckModalOpen } = useDeckContexts();
  const downloadDeckCsv = useDownloadDeckCsv();
  const handleDeleteDeck = (): void => {
    void deleteDeckFromGroup(groupId, deckId);
  };

  const handleShareDeck = (): void => {
    setDeckId(deckId);
    setIsShareDeckModalOpen(true);
  };

  const saveDeckFromGroup = (): void => {
    void dispatch(saveGroupDeck({ groupId, deckId }));
  };

  const links = [
    {
      label: "Save",
      icon: SaveIcon,
      type: "",
      onClick: saveDeckFromGroup,
    },
    {
      label: "Share",
      type: "middle",
      icon: ShareIcon,
      onClick: handleShareDeck,
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
    ...(type === "groupAdmin"
      ? [
          //   {
          //     label: "Edit",
          //     type: "middle",
          //     icon: EditIcon,
          //     onClick: () => {},
          //   },
          {
            label: "Delete",
            type: "middle",
            icon: DeleteIcon,
            onClick: handleDeleteDeck,
          },
        ]
      : []),
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

export { GroupDeckDropdown };

// // Here we finish constructing the links adding in the groupId, deckId and boolean.
