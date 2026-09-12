import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import DownloadIcon from "@assets/cardMenuIcons/DownloadIcon.svg?react";
import EditIcon from "@assets/cardMenuIcons/EditIcon.svg?react";
import ExportIcon from "@assets/cardMenuIcons/ExportIcon.svg?react";
import ShareIcon from "@assets/cardMenuIcons/ShareIcon.svg?react";
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
  isAdmin: boolean
): LinksType[] => [
  {
    label: "Save",
    href: null,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId, groupId },
  },
  {
    label: "View",
    href: null,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId, groupId },
  },
  {
    label: "Download",
    href: null,
    icon: DownloadIcon,
    type: "",
    itemIds: { deckId, groupId },
  },
  ...(isAdmin
    ? [
        {
          href: null,
          label: "Edit",
          type: "middle",
          icon: EditIcon,
          itemIds: { deckId, groupId },
        },
        {
          href: null,
          label: "Remove",
          type: "middle",
          icon: DeleteIcon,
          itemIds: { deckId, groupId },
        },
      ]
    : []),
];

const getBasicLinks = (deckId: number, isExtended: boolean) => [
  {
    label: "Save",
    href: null,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId },
  },
  {
    label: "View",
    href: `decks/${deckId}`,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId },
  },
  {
    label: "Download",
    href: "",
    icon: DownloadIcon,
    type: "",
    itemIds: { deckId },
  },
  ...(isExtended
    ? [
        {
          href: `study/deck/${deckId}`,
          label: "Study",
          type: "middle",
          icon: StudyIcon,
          itemIds: { deckId },
        },
        {
          href: null,
          label: "Share",
          type: "middle",
          icon: ShareIcon,
          itemIds: { deckId },
        },
        {
          href: null,
          label: "Export",
          type: "middle",
          icon: ExportIcon,
          itemIds: { deckId },
        },
        {
          href: null,
          label: "Delete",
          type: "middle",
          icon: DeleteIcon,
          itemIds: { deckId },
        },
      ]
    : []),
];
const getPublicLinks = (deckId: number) => [
  {
    label: "Save",
    href: null,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId },
  },
  {
    label: "View",
    href: null,
    icon: StudyIcon,
    type: "",
    itemIds: { deckId },
  },
  {
    label: "Download",
    href: null,
    icon: DownloadIcon,
    type: "",
    itemIds: { deckId },
  },
];

export { getBasicLinks, getGroupLinks, getPublicLinks };
