import { createAsyncThunk } from "@reduxjs/toolkit";
import { GroupService } from "@source/client";
import { type CreateGroupDataRequest } from "@source/client";

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
  const result = await GroupService.getAllGroupsForUser();
  return result;
});

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

export const createNewGroup = createAsyncThunk(
  "groups/createNewGroup",
  async (request: CreateGroupDataRequest) => {
    const result = await GroupService.createGroup(request);
    return result;
  }
);
