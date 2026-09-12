import { createSlice } from "@reduxjs/toolkit";
import { type UserSettingsSchema } from "@source/client";

import { logoutUser } from "../user/actions";
import { fetchUserSettings, updateUserSettings } from "./actions";

interface UserSettingsState {
  userSettings: UserSettingsSchema | null | undefined;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}

const initialState: UserSettingsState = {
  userSettings: null,
  status: "idle",
  error: "",
};
const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userSettings = action.payload;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userSettings = null;
        state.status = "idle";
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.userSettings = action.payload.settings;
      });
  },
});

export default userSettingsSlice.reducer;
