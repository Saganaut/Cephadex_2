import { createAsyncThunk } from "@reduxjs/toolkit";
import { AdminService, type LlmRecordsSchema } from "@source/client";

export const fetchPromptData = createAsyncThunk(
  "promptData/fetchPromptData",
  async () => {
    const result = await AdminService.getLlmData();
    return result;
  }
);

export const upvotePromptData = createAsyncThunk(
  "promptData/upvotePromptData",
  async (id: number) => {
    const result = await AdminService.upvoteRecord(id);
    return result;
  }
);
export const downvotePromptData = createAsyncThunk(
  "promptData/downvotePromptData",
  async (id: number) => {
    const result = await AdminService.downvoteRecord(id);
    return result;
  }
);
