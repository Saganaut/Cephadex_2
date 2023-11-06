import { createSlice } from "@reduxjs/toolkit";
import { type Group } from "@source/types/Group";
import { fetchGroupsThunk } from "@source/services/Api/Group/GroupApiThunks";

interface GroupsState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroupsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroupsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
