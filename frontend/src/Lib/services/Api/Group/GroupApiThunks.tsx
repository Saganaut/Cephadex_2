import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logger } from "@utils/Logger";

export const fetchGroupsThunk = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/group_bp/api_0/groups",
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        return response.data["groups"].map((group) => ({
          ...group,
          type: "Group",
        }));
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      logger.error("An error occurred in fetchGroupsThunk", error);
      return rejectWithValue(error.response.data);
    }
  }
);
