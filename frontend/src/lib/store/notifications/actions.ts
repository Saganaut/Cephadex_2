import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "@source/client";
import {
  type NotificationsResponse,
  type NotificationsSchema,
} from "@source/client";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (): Promise<NotificationsResponse> => {
    const result = await UserService.getNotifications();
    return result;
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (
    body: NotificationsSchema
  ): Promise<{ result: NotificationsResponse; body: NotificationsSchema }> => {
    const result = await UserService.updateNotifications(body);
    return { result, body };
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (
    body: NotificationsSchema
  ): Promise<{
    result: NotificationsResponse;
    body: NotificationsSchema;
    message: string;
  }> => {
    const result = await UserService.deleteNotifications(body);
    return { result, body, message: result.message };
  }
);

export const checkNewNotifications = createAsyncThunk(
  "notifications/checkNewNotifications",
  async (): Promise<NotificationsResponse> => {
    const result = await UserService.checkNewNotifications();
    return result;
  }
);
