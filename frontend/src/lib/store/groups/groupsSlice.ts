import {
  createEntityAdapter,
  createSlice,
  type EntityState,
} from "@reduxjs/toolkit";
import { GroupFullSchema, type GroupSchema } from "@source/client";
import { type RootState } from "@store/store";

import { logoutUser } from "../user/actions";
import {
  createNewGroup,
  deleteGroupImg,
  deleteOneGroup,
  fetchGroups,
  updateGroup,
} from "./actions";

export interface GroupsSliceState extends EntityState<GroupSchema> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}
const groupsAdapter = createEntityAdapter<GroupSchema>({
  sortComparer: (a, b) => a.id - b.id,
});

const initialState: GroupsSliceState = groupsAdapter.getInitialState({
  status: "idle",
  error: "",
});
const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        groupsAdapter.upsertMany(state, action.payload.groups as GroupSchema[]);
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })

      .addCase(deleteOneGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        groupsAdapter.removeOne(state, action.payload.groupId);
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.groups != null && action.payload.groups.length > 0) {
          groupsAdapter.addOne(state, action.payload.groups[0]);
        }
      })

      .addCase(logoutUser.fulfilled, (state) => {
        groupsAdapter.removeAll(state);
        state.status = "idle";
      });
  },
});

export default groupsSlice.reducer;
export const {
  selectAll: selectAllGroups,
  selectById: selectGroupById,
  selectIds: selectGroupIds,
} = groupsAdapter.getSelectors((state: RootState) => state.groups);
