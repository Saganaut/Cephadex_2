import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService, type UserSettingsSchema } from "@source/client";

export const fetchUserSettings = createAsyncThunk(
  "user/fetchUserSettings",
  async (): Promise<UserSettingsSchema | null | undefined> => {
    return await UserService.getUserSettings().then((r) => r.userSettings);
  }
);

export const updateUserSettings = createAsyncThunk(
  "user/updateUserSettings",
  async (
    settings: UserSettingsSchema
  ): Promise<{
    response: any;
    settings: UserSettingsSchema;
    message: string;
  }> => {
    const response = await UserService.updateUserSettings(settings);
    return { response, settings, message: response.message };
  }
);
