import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { type LlmRecordsSchema } from "@source/client/models/LlmRecordsSchema";
import { type RootState } from "@store/store";

import {
  downvotePromptData,
  fetchPromptData,
  upvotePromptData,
} from "./actions";

const promptDataAdapter = createEntityAdapter<LlmRecordsSchema>({});

const initialState = promptDataAdapter.getInitialState({
  status: "idle",
  error: "",
});

const promptDataSlice = createSlice({
  name: "promptData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromptData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPromptData.fulfilled, (state, action) => {
        state.status = "succeeded";
        promptDataAdapter.setAll(state, action.payload.records);
      })
      .addCase(fetchPromptData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
      .addCase(upvotePromptData.fulfilled, (state, action) => {
        promptDataAdapter.removeOne(state, action.payload.records[0].id);
      })
      .addCase(downvotePromptData.fulfilled, (state, action) => {
        promptDataAdapter.removeOne(state, action.payload.records[0].id);
      });
  },
});

export default promptDataSlice.reducer;
export const promptDataSelectors = promptDataAdapter.getSelectors<RootState>(
  (state) => state.promptData
);
