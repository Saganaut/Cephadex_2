import { type User } from "@customTypes/User";
import { logger } from "@source/Lib/utils/Logger";

import { axiosPrivate } from "./axios";

interface CheckUserAuthResponse {
  isLoggedIn: boolean;
  user: User | null;
}
const checkUserAuth = async (): Promise<CheckUserAuthResponse> => {
  try {
    const response = await axiosPrivate.get("/user_bp/api_0/auth/status");
    if (response.data.status === "success") {
      logger.log("User is logged in:", response.data);
      return { isLoggedIn: true, user: response.data.user };
    } else {
      console.warn("User is not authenticated");
      return { isLoggedIn: false, user: null };
    }
  } catch (error) {
    logger.error("An error occurred while sending token to backend:", error);
    return { isLoggedIn: false, user: null };
  }
};

export { checkUserAuth };
