import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type User } from "@source/types/User";
import { fetchUserThunk } from "@services/Api/User/UserApiThunks";
import { logoutThunk } from "@services/Api/User/UserApiThunks";
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        return initialState;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
