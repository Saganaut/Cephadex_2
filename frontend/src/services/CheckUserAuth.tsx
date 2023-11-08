import axios from "axios";
import { logger } from "@source/Lib/utils/Logger";

const checkUserAuth = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/user_bp/api_0/auth/status",
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      logger.log("User is logged in:", response.data);
      return response.data["user"];
    } else if (response.data.status === "not authenticated") {
      console.warn("User is not authenticated");
      return false;
    }
  } catch (error) {
    logger.error("An error occurred while sending token to backend:", error);
  }
};

export { checkUserAuth };
