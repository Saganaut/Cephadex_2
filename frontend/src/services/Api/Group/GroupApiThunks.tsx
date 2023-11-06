import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchGroupsThunk = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/group_bp/api_0/groups",
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        console.log(response.data);
        return response.data["groups"].map((group) => ({
          ...group,
          type: "Group",
        }));
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching Groups:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
