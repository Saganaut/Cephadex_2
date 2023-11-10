import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type UserSettings } from "@source/types/User";
import { fetchUserSettingsThunk } from "@services/Api/User/UserApiThunks";

interface UserSettingsState {
  usersettings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserSettingsState = {
  usersettings: null,
  loading: false,
  error: null,
};
const userSettingsSlice = createSlice({
  name: "usersettings",
  initialState,
  reducers: {
    setUserSettings: (state, action: PayloadAction<UserSettings>) => {
      state.usersettings = action.payload;
    },
    logout: (state) => {
      state.usersettings = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSettingsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserSettingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.usersettings = action.payload;
      })
      .addCase(fetchUserSettingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserSettings, logout } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;
