import {
  type AccountDeletionRequest,
  type StandardApiResponse,
  type UserUpdateRequest,
} from "@source/client";
import { useAppDispatch } from "@source/lib/store/hooks";
import type { PartialUserUpdateRequest } from "@source/types/User";

import {
  checkNewsletterSubscription,
  deleteAccount,
  deleteProfilePicture,
  disableEmailNotifications,
  enableEmailNotifications,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  updateAccount,
  updateProfilePicture,
} from "../../store/user/actions";

const useAccount = (): {
  checkNewsletterSubIsTrue: () => Promise<boolean>;
  subscribeNewsletter: (email: string) => () => Promise<boolean>;
  unsubscribNewsletter: (email: string) => () => Promise<boolean>;
  deleteUserAccount: (body: AccountDeletionRequest) => Promise<boolean>;
  updateUserPic: (image: File) => Promise<boolean>;
  deleteProfilePic: () => Promise<boolean>;
  updateUserAccount: (body: UserUpdateRequest) => Promise<boolean>;
  enableEmailNotifs: () => Promise<boolean>;
  disableEmailNotifs: () => Promise<boolean>;
} => {
  const dispatch = useAppDispatch();

  const checkNewsletterSubIsTrue = async (): Promise<boolean> => {
    const response = await dispatch(checkNewsletterSubscription());
    if ((response.payload as StandardApiResponse).message === "Subscribed") {
      return true;
    }
    return false;
  };

  const subscribeNewsletter = (email: string) => async (): Promise<boolean> => {
    try {
      void dispatch(subscribeToNewsletter(email));
      return true;
    } catch (error) {
      return false;
    }
  };

  const unsubscribNewsletter =
    (email: string) => async (): Promise<boolean> => {
      try {
        void dispatch(unsubscribeFromNewsletter(email));
        return true;
      } catch (error) {
        return false;
      }
    };

  const enableEmailNotifs = async (): Promise<boolean> => {
    try {
      await dispatch(enableEmailNotifications());
      return true;
    } catch (error) {
      return false;
    }
  };
  const disableEmailNotifs = async (): Promise<boolean> => {
    try {
      await dispatch(disableEmailNotifications());
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateUserAccount = async (
    body: PartialUserUpdateRequest
  ): Promise<boolean> => {
    try {
      await dispatch(updateAccount(body));
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateUserPic = async (image: File): Promise<boolean> => {
    try {
      await dispatch(updateProfilePicture(image));
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteProfilePic = async (): Promise<boolean> => {
    try {
      await dispatch(deleteProfilePicture());
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteUserAccount = async (
    body: AccountDeletionRequest
  ): Promise<boolean> => {
    try {
      await dispatch(deleteAccount(body));
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    checkNewsletterSubIsTrue,
    subscribeNewsletter,
    unsubscribNewsletter,
    deleteUserAccount,
    updateUserPic,
    deleteProfilePic,
    updateUserAccount,
    enableEmailNotifs,
    disableEmailNotifs,
  };
};

export { useAccount };
