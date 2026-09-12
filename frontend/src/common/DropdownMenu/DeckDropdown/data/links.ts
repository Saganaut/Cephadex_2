export interface LinksType {
  label: string;
  icon: React.ElementType;
  type: string;
  onClick?: () => void;
}

// const getGroupLinks = (
//   groupId: number,
//   deckId: number,
//   isAdmin: boolean
// ): LinksType[] => [
//   {
//     label: "Save",
//     href: null,
//     icon: StudyIcon,
//     type: "",
//     itemIds: { deckId, groupId },
//   },
//   {
//     label: "View",
//     href: null,
//     icon: StudyIcon,
//     type: "",
//     itemIds: { deckId, groupId },
//   },
//   {
//     label: "Download",
//     href: null,
//     icon: DownloadIcon,
//     type: "",
//     itemIds: { deckId, groupId },
//   },
//   ...(isAdmin
//     ? [
//         {
//           href: null,
//           label: "Edit",
//           type: "middle",
//           icon: EditIcon,
//           itemIds: { deckId, groupId },
//         },
//         {
//           href: null,
//           label: "Remove",
//           type: "middle",
//           icon: DeleteIcon,
//           itemIds: { deckId, groupId },
//         },
//       ]
//     : []),
// ];

// const getPublicLinks = (deckId: number) => [
//   {
//     label: "Save",
//     href: null,
//     icon: StudyIcon,
//     type: "",
//     itemIds: { deckId },
//   },
//   {
//     label: "View",
//     href: null,
//     icon: StudyIcon,
//     type: "",
//     itemIds: { deckId },
//   },
//   {
//     label: "Download",
//     href: null,
//     icon: DownloadIcon,
//     type: "",
//     itemIds: { deckId },
//   },
// ];

// export { getBasicLinks, getGroupLinks, getPublicLinks };
