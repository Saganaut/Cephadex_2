import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  type AccountDeletionRequest,
  type FeedbackRequest,
  FeedbackService,
  type LogoutResponse,
  NewsletterService,
  type StandardApiResponse,
  type UsageRecordResponse,
  type UserDataResponse,
  type UserUpdateRequest,
} from "@source/client";
import { UserService } from "@source/client";

import { fetchNotifications } from "../notifications/actions";
import { fetchUserSettings } from "../userSettings/actions";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (): Promise<UserDataResponse> => {
    const result = await UserService.getUser();
    return result;
  }
);

export const getUserStatus = createAsyncThunk(
  "user/getUserStatus",
  async (): Promise<UserDataResponse> => {
    const result = await UserService.checkUserStatus();
    return result;
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (): Promise<LogoutResponse> => {
    const result = await UserService.logout();
    return result;
  }
);
// TODO: Potentially remove the fetch ntoifications and fetch user settings here
export const checkUserAuth = createAsyncThunk(
  "user/checkUserAuth",
  async (arg, { dispatch }) => {
    try {
      const response = await UserService.checkUserStatus();
      if (response.status === "success") {
        void dispatch(fetchUserSettings());
        void dispatch(fetchNotifications());
        return {
          status: response.status,
          loggedIn: true,
          user: response.user,
          message: response.message,
        };
      } else {
        return {
          status: response.status,
          loggedIn: false,
          user: null,
          message: response.message,
        };
      }
    } catch (error) {
      return { status: "failed", loggedIn: false, user: null };
    }
  }
);

export const refreshToken = createAsyncThunk("user/refreshToken", async () => {
  void (await UserService.refreshToken());
});

export const refreshUserData = createAsyncThunk(
  "user/refreshUserData",
  async (type: string): Promise<UserDataResponse> => {
    const response = await UserService.updateUserData(type);
    return response;
  }
);

export const checkNewsletterSubscription = createAsyncThunk(
  "user/checkNewsletterSubscription",
  async (): Promise<StandardApiResponse> => {
    const response = await NewsletterService.checkSubscriptionForUser();
    return response;
  }
);

export const subscribeToNewsletter = createAsyncThunk(
  "user/subscribeToNewsletter",
  async (email: string): Promise<StandardApiResponse> => {
    const response = await NewsletterService.subscribe({ email });
    return response;
  }
);

export const unsubscribeFromNewsletter = createAsyncThunk(
  "user/unsubscribeFromNewsletter",
  async (email: string): Promise<StandardApiResponse> => {
    const response = await NewsletterService.unsubscribe({ email });
    return response;
  }
);

export const disableEmailNotifications = createAsyncThunk(
  "user/disableEmailNotifications",
  async (): Promise<StandardApiResponse> => {
    const response = await UserService.disableEmailNotifications();
    return response;
  }
);

export const enableEmailNotifications = createAsyncThunk(
  "user/enableEmailNotifications",
  async (): Promise<StandardApiResponse> => {
    const response = await UserService.enableEmailNotifications();
    return response;
  }
);

export const updateAccount = createAsyncThunk(
  "user/updateAccount",
  async ({ body }: { body: UserUpdateRequest }) => {
    const response = await UserService.updateAccount(body);
    return { response, body };
  }
);

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (image: File): Promise<UserDataResponse> => {
    const response = await UserService.updateProfilePicture({
      profile_pic: image,
    });
    return response;
  }
);

export const deleteProfilePicture = createAsyncThunk(
  "user/deleteProfilePicture",
  async (): Promise<UserDataResponse> => {
    const response = await UserService.deleteProfilePicture();
    return response;
  }
);

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (type: string): Promise<UserDataResponse> => {
    const response = await UserService.updateUserData(type);
    return response;
  }
);

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (body: AccountDeletionRequest): Promise<StandardApiResponse> => {
    const response = await UserService.deleteAccount(body);
    return response;
  }
);

export const postFeedback = createAsyncThunk(
  "user/postFeedback",
  async (body: FeedbackRequest): Promise<StandardApiResponse> => {
    const response = await FeedbackService.feedback(body);
    return response;
  }
);

export const fetchRemainingCredit = createAsyncThunk(
  "user/fetchRemainingCredit",
  async (): Promise<UsageRecordResponse> => {
    const response = await UserService.remainingCredit();
    return response;
  }
);
