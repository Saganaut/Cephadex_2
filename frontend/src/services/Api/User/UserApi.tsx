// fetch user settings
// log out
import { type UserSettings } from "@customTypes/User";
import { axiosPrivate } from "@services/axios";
import axios from "axios";

interface UserSettingsResponse {
  isLoggedIn: boolean;
  userSettings: UserSettings | null;
}
const fetchUserSettings = async (): Promise<UserSettingsResponse> => {
  const response = await axiosPrivate.get("/user_bp/api_0/user/settings");
  try {
    if (response.status === 200) {
      return { isLoggedIn: true, userSettings: response.data.userSettings };
    } else {
      return { isLoggedIn: false, userSettings: null };
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to get your user settings:",
      error
    );
    return { isLoggedIn: false, userSettings: null };
  }
};

const updateUserSettings = (data) => {
  const response = axios.patch(
    "http://localhost:5000/user_bp/api_0/user/settings",
    data,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return response.data.settings;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to update your user settings:",
      error
    );
  }
};

const logoutUser = () => {
  const response = axios.delete(
    "http://localhost:5000/user_bp/api_0/auth/logout",
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to log out your user:",
      error
    );
  }
};

export { logoutUser };
export { updateUserSettings };
export { fetchUserSettings };
