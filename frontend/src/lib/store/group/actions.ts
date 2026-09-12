import { createAsyncThunk } from "@reduxjs/toolkit";
import { GroupService } from "@source/client";
import {
  type DeckSchema,
  type GroupInviteSchema,
  type PermissionChange,
} from "@source/client";

interface UsersLookedUp {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export const fetchGroup = createAsyncThunk(
  "groups/fetchGroup",
  async (groupId: number) => {
    const result = await GroupService.getGroup(groupId);
    return result;
  }
);

export const deleteOneGroup = createAsyncThunk(
  "groups/deleteOneGroup",
  async (groupId: number) => {
    const result = await GroupService.deleteGroup(groupId);
    return {
      groupId,
      result,
      message: result.message,
    };
  }
);

export const removeOneDeckFromGroup = createAsyncThunk(
  "groups/removeOneDeckFromGroup",
  async ({ groupId, deckId }: { groupId: number; deckId: number }) => {
    const result = await GroupService.removeDeckFromGroup(groupId, deckId);
    return {
      groupId,
      deckId,
      result,
      message: result.message,
    };
  }
);

export const addDecksToGroup = createAsyncThunk(
  "groups/addDecksToGroup",
  async ({ groupId, decks }: { groupId: number; decks: DeckSchema[] }) => {
    const result = await GroupService.addDeckToGroup(groupId, {
      decks: decks.map((deck) => deck.id),
    });
    return {
      groupId,
      decks,
      result,
      message: result.message,
    };
  }
);

export const inviteUsersToGroup = createAsyncThunk(
  "groups/inviteUsersToGroup",
  async ({
    groupId,
    invitees,
    emails,
  }: {
    groupId: number;
    invitees: UsersLookedUp[];
    emails: Array<{ email: string }>;
  }) => {
    const result = await GroupService.inviteToGroup(groupId, {
      invitees,
      emails,
    });
    return {
      groupId,
      invitees,
      result,
      emails,
      message: result.message,
    };
  }
);

export const deleteInvitation = createAsyncThunk(
  "groups/deleteInvitation",
  async ({
    groupId,
    InvitesToDelete,
  }: {
    groupId: number;
    InvitesToDelete: GroupInviteSchema[];
  }) => {
    const result = await GroupService.deleteInvitations(groupId, {
      InvitesToDelete, // TODO: Fix this
    });
    return {
      groupId,
      InvitesToDelete,
      result,
      message: result.message,
    };
  }
);

export const updatePermissions = createAsyncThunk(
  "groups/updatePermissions",
  async ({
    groupId,
    permissionsToChange,
  }: {
    groupId: number;
    permissionsToChange: PermissionChange[];
  }) => {
    const result = await GroupService.updateMemberPermissions(groupId, {
      permissionsToChange,
    });
    return {
      groupId,
      permissionsToChange,
      result,
      message: result.message,
    };
  }
);
export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ groupId, body }: { groupId: number; body: any }) => {
    const result = await GroupService.updateGroup(groupId, body);
    return { groupId, result, message: result.message };
  }
);

export const deleteGroupImg = createAsyncThunk(
  "groups/deleteGroupImg",
  async (groupId: number) => {
    const result = await GroupService.deleteGroupPicture(groupId);
    return {
      groupId,
      result,
      message: result.message,
    };
  }
);
