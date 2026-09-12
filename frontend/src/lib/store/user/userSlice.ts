import { createSlice } from "@reduxjs/toolkit";
import { type UserSchema } from "@source/client";

import {
  checkUserAuth,
  deleteProfilePicture,
  disableEmailNotifications,
  enableEmailNotifications,
  fetchUser,
  getUserStatus,
  logoutUser,
  refreshUserData,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  updateAccount,
  updateProfilePicture,
  updateUserData,
} from "./actions";

export interface UserState {
  user: UserSchema | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.user !== undefined) {
          state.user = action.payload.user;
        }
      })
      .addCase(getUserStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.user !== undefined) {
          state.user = action.payload.user;
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.user !== undefined) {
          state.user = action.payload.user;
        }
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(refreshUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.user != null) {
          state.user = action.payload.user;
        }
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.user != null) {
          state.user.subscriber = true;
        }
      })
      .addCase(unsubscribeFromNewsletter.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.user != null) {
          state.user.subscriber = false;
        }
      })
      .addCase(enableEmailNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.user != null) {
          state.user.contactedEmail = true;
        }
      })
      .addCase(disableEmailNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.user != null) {
          state.user.contactedEmail = false;
        }
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.response.user != null) {
          state.user = action.payload.response.user;
        }
      });
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
