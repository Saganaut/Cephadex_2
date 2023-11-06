import { type User } from "@customTypes/User";

import { axiosPrivate } from "./axios";

interface CheckUserAuthResponse {
  isLoggedIn: boolean;
  user: User | null;
}
const checkUserAuth = async (): Promise<CheckUserAuthResponse> => {
  try {
    const response = await axiosPrivate.get("/user_bp/api_0/auth/status");
    if (response.data.status === "success") {
      console.log("User is logged in:", response.data.user);
      return { isLoggedIn: true, user: response.data.user };
    } else {
      console.error("User is not logged in:", response.status);
      return { isLoggedIn: false, user: null };
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
    return { isLoggedIn: false, user: null };
  }
};

export { checkUserAuth };
