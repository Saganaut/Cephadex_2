import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import EditIcon from "@assets/cardMenuIcons/EditIcon.svg?react";
import StudyIcon from "@assets/cardMenuIcons/StudyIcon.svg?react";

export interface LinksType {
  href: string | null;
  label: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | undefined;
  type: string;
  itemIds: Record<string, number>;
}

const getGroupLinks = (
  groupId: number,
  deckId: number,
  cardId: number,
  isAdmin: boolean
): LinksType[] => [
  {
    label: "View",
    href: null,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId, cardId, groupId },
  },

  ...(isAdmin
    ? [
        {
          href: null,
          label: "Edit",
          type: "middle",
          icon: EditIcon,
          itemIds: { deckId, cardId, groupId },
        },
        {
          href: null,
          label: "Remove",
          type: "middle",
          icon: DeleteIcon,
          itemIds: { deckId, cardId, groupId },
        },
      ]
    : []),
];

const getBasicLinks = (deckId: number, cardId: number, isExtended: boolean) => [
  {
    label: "View",
    href: `decks/${deckId}`,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId, cardId },
  },
  ...(isExtended
    ? [
        {
          href: null,
          label: "Delete",
          type: "middle",
          icon: DeleteIcon,
          itemIds: { deckId, cardId },
        },
        {
          href: null,
          label: "Edit",
          type: "middle",
          icon: EditIcon,
          itemIds: { deckId, cardId },
        },
      ]
    : []),
];

export { getBasicLinks, getGroupLinks };
