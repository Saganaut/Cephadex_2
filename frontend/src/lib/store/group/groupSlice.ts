import {
  createEntityAdapter,
  createSlice,
  type EntityState,
} from "@reduxjs/toolkit";
import { type GroupFullSchema } from "@source/client";
import { type RootState } from "@store/store";

import { deleteOneGroup } from "../groups/actions";
import { logoutUser } from "../user/actions";
import {
  addDecksToGroup,
  deleteGroupImg,
  deleteInvitation,
  fetchGroup,
  inviteUsersToGroup,
  removeOneDeckFromGroup,
  updateGroup,
  updatePermissions,
} from "./actions";

export interface GroupSliceState extends EntityState<GroupFullSchema> {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
  groupsLoaded: number[];
}

const groupAdapter = createEntityAdapter<GroupFullSchema>({
  selectId: (groupFullSchema) => groupFullSchema.group.id,
  sortComparer: (a, b) => a.group.id - b.group.id,
});

const initialState = groupAdapter.getInitialState({
  status: "idle",
  error: "",
  groupsLoaded: [],
});
const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchGroup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        groupAdapter.upsertMany(
          state,
          action.payload.group as GroupFullSchema[]
        );
      })
      .addCase(fetchGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })

      .addCase(deleteOneGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        groupAdapter.removeOne(state, action.payload.groupId);
      })
      .addCase(removeOneDeckFromGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        const group = state.entities[action.payload.groupId];
        if (group != null) {
          group.decks = (group.decks ?? []).filter(
            (deck) => deck.id !== action.payload.deckId
          );
        }
      })
      .addCase(addDecksToGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        const group = state.entities[action.payload.groupId];
        if (group != null) {
          action.payload.decks.forEach((deck) => {
            group.decks?.push(deck);
          });
        }
      })
      .addCase(inviteUsersToGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        const group = state.entities[action.payload.groupId];
        if (group != null) {
          action.payload.result.invitedUsers?.forEach((invitation) => {
            group.invites?.push(invitation);
          });
        }
      })
      .addCase(deleteInvitation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const group = state.entities[action.payload.groupId];
        if (group != null) {
          group.invites = group.invites?.filter(
            (invite) =>
              !action.payload.InvitesToDelete.some(
                (toDelete) => toDelete.id === invite.id
              )
          );
        }
      })
      .addCase(updatePermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        const group = state.entities[action.payload.groupId];
        if (group != null) {
          action.payload.permissionsToChange.forEach((permission) => {
            group.members = group.members?.map((member) => {
              if (member.id === permission.id) {
                return {
                  ...member,
                  permissions: permission.permissions,
                  groupRole: permission.role,
                };
              }
              return member;
            });
          });
        }
      })
      // .addCase(updateGroup.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   if (
      //     action.payload.result.groups === null ||
      //     action.payload.result.groups === undefined
      //   ) {
      //     return;
      //   }
      //   const group = state.entities[action.payload.result.groups[0].id];
      //   if (group != null) {
      //     group.group = { ...group.group, ...action.payload.result.groups[0] };
      //   }
      // })
      .addCase(logoutUser.fulfilled, (state) => {
        groupAdapter.removeAll(state);
        state.status = "idle";
        state.groupsLoaded = [];
      })
      .addCase(deleteGroupImg.fulfilled, (state, action) => {
        state.status = "succeeded";
        const group = state.entities[action.payload.groupId];
        if (group != null) {
          group.group.img = null;
        }
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (
          action.payload.result.groups != null &&
          action.payload.result.groups.length > 0
        ) {
          const existingGroup = state.entities[action.payload.groupId];
          if (existingGroup?.group !== undefined) {
            groupAdapter.updateOne(state, {
              id: action.payload.groupId,
              changes: {
                group: {
                  ...state.entities[action.payload.groupId].group,
                  ...action.payload.result.groups[0],
                },
              },
            });
          }
        }
      });
  },
});
export default groupSlice.reducer;
export const {
  selectById: selectGroupById,
  // other selectors if needed
} = groupAdapter.getSelectors((state: RootState) => state.group);
