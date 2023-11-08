import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logger } from "@source/Lib/utils/Logger";

const fetchUserThunk = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user_bp/api_0/user",
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        return response.data.user;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching user data."
      );
    }
  }
);

const fetchUserSettingsThunk = createAsyncThunk(
  "user/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user_bp/api_0/user/settings",
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        return response.data.settings;
      } else {
        return rejectWithValue(false);
      }
    } catch (error) {
      console.error(
        "An error occurred while trying to get your user settings:",
        error
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const logoutThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/user_bp/api_0/auth/logout",
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        return response.data;
      } else {
        return rejectWithValue(false);
      }
    } catch (error) {
      logger.error("An error occurred while trying to logout:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export { fetchUserSettingsThunk };
export { fetchUserThunk };
export { logoutThunk };
