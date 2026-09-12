import {
  createEntityAdapter,
  createSlice,
  type EntityState,
} from "@reduxjs/toolkit";
import { type NotificationsSchema } from "@source/client";
import { type RootState } from "@store/store";

import { logoutUser } from "../user/actions";
import {
  checkNewNotifications,
  deleteNotification,
  fetchNotifications,
  markAsRead,
} from "./actions";

export interface NotificationsState extends EntityState<NotificationsSchema> {
  notifications: NotificationsSchema[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}

const notificationsAdapter = createEntityAdapter<NotificationsSchema>({
  sortComparer: (a, b) => a.id - b.id,
});

const initialState: NotificationsState = notificationsAdapter.getInitialState({
  notifications: [],
  status: "idle",
  error: "",
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        notificationsAdapter.upsertMany(
          state,
          action.payload.notifications as NotificationsSchema[]
        );
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        notificationsAdapter.removeOne(state, action.payload.body.id);
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { body } = action.payload;
        const notificationEntity = state.entities[body.id];
        if (notificationEntity != null) {
          notificationEntity.read = true;
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.notifications = [];
        state.status = "idle";
      })
      .addCase(checkNewNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        notificationsAdapter.upsertMany(
          state,
          action.payload.notifications as NotificationsSchema[]
        );
      });
  },
});

export default notificationsSlice.reducer;
export const { setNotifications } = notificationsSlice.actions;
export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
} = notificationsAdapter.getSelectors(
  (state: RootState) => state.notifications
);
