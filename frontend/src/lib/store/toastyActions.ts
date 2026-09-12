import { deleteOneCard, updateOneCard } from "./cardInstances/actions";
import {
  copyCardToDeck,
  createOneCard,
  generateNewCards,
  importCardsFromAnki,
  importCardsFromCSV,
  importCardsFromOtherDecks,
  regenerateOneCard,
} from "./cards/actions";
import { deleteOneDeckFile } from "./deckFiles/actions";
import {
  copyPublicDeck,
  deleteOneDeck,
  saveGroupDeck,
  sendCardsBatch,
  updateOneDeck,
} from "./decks/actions";
import {
  addDecksToGroup,
  deleteInvitation,
  inviteUsersToGroup,
  removeOneDeckFromGroup,
  updateGroup,
  updatePermissions,
} from "./group/actions";
import { createNewGroup, deleteOneGroup } from "./groups/actions";
import { deleteNotification } from "./notifications/actions";
import { deleteOneQuiz, updateOneQuiz } from "./quizzes/actions";
import {
  deleteProfilePicture,
  disableEmailNotifications,
  enableEmailNotifications,
  logoutUser,
  postFeedback,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  updateAccount,
  updateProfilePicture,
} from "./user/actions";
import {  } from "./userSettings/actions";

const cardInstancesActions = [
  deleteOneCard.fulfilled.type,
  deleteOneCard.rejected.type,
  regenerateOneCard.fulfilled.type,
  regenerateOneCard.rejected.type,
  updateOneCard.fulfilled.type,
  updateOneCard.rejected.type,
];

const userActions = [
  logoutUser.fulfilled.type,
  logoutUser.rejected.type,
  deleteProfilePicture.fulfilled.type,
  deleteProfilePicture.rejected.type,
  disableEmailNotifications.fulfilled.type,
  disableEmailNotifications.rejected.type,
  enableEmailNotifications.fulfilled.type,
  enableEmailNotifications.rejected.type,
  postFeedback.fulfilled.type,
  postFeedback.rejected.type,
  subscribeToNewsletter.fulfilled.type,
  subscribeToNewsletter.rejected.type,
  unsubscribeFromNewsletter.fulfilled.type,
  unsubscribeFromNewsletter.rejected.type,
  updateAccount.fulfilled.type,
  updateAccount.rejected.type,
  updateProfilePicture.fulfilled.type,
  updateProfilePicture.rejected.type,
];

const notificationsActions = [
  deleteNotification.fulfilled.type,
  deleteNotification.rejected.type,
];

const quizzesActions = [
  deleteOneQuiz.fulfilled.type,
  deleteOneQuiz.rejected.type,
  updateOneQuiz.fulfilled.type,
  updateOneQuiz.rejected.type,
];

const groupsActions = [
  createNewGroup.fulfilled.type,
  createNewGroup.rejected.type,
  deleteOneGroup.fulfilled.type,
  deleteOneGroup.rejected.type,
  updateGroup.fulfilled.type,
  updateGroup.rejected.type,
];

const groupActions = [
  addDecksToGroup.fulfilled.type,
  addDecksToGroup.rejected.type,
  deleteInvitation.fulfilled.type,
  deleteInvitation.rejected.type,
  inviteUsersToGroup.fulfilled.type,
  inviteUsersToGroup.rejected.type,
  removeOneDeckFromGroup.fulfilled.type,
  removeOneDeckFromGroup.rejected.type,
  updatePermissions.fulfilled.type,
  updatePermissions.rejected.type,
];

const deckFilesActions = [
  deleteOneDeckFile.fulfilled.type,
  deleteOneDeckFile.rejected.type,
];

const deckActions = [
  copyPublicDeck.fulfilled.type,
  copyPublicDeck.rejected.type,
  deleteOneDeck.fulfilled.type,
  deleteOneDeck.rejected.type,

  sendCardsBatch.fulfilled.type,
  sendCardsBatch.rejected.type,
  updateOneDeck.fulfilled.type,
  updateOneDeck.rejected.type,
  saveGroupDeck.fulfilled.type,
  saveGroupDeck.rejected.type,
];
const cardActions = [
  copyCardToDeck.fulfilled.type,
  copyCardToDeck.rejected.type,
  createOneCard.fulfilled.type,
  createOneCard.rejected.type,
  generateNewCards.fulfilled.type,
  generateNewCards.rejected.type,
  importCardsFromAnki.fulfilled.type,
  importCardsFromAnki.rejected.type,
  importCardsFromCSV.fulfilled.type,
  importCardsFromCSV.rejected.type,
  importCardsFromOtherDecks.fulfilled.type,
  importCardsFromOtherDecks.rejected.type,
  regenerateOneCard.fulfilled.type,
  regenerateOneCard.rejected.type,
];

const toastyActions = [
  ...cardActions,
  ...deckFilesActions,
  ...deckActions,
  ...userActions,
  ...notificationsActions,
  ...quizzesActions,
  ...groupsActions,
  ...groupActions,
  ...cardInstancesActions,
];

export { toastyActions };
