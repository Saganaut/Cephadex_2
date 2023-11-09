import { type User } from "@customTypes//User";
import { type CredentialResponse } from "@react-oauth/google";
import { type AxiosError } from "axios";
import { logger } from "@source/Lib/utils/Logger";

import { axiosPrivate } from "./axios";

interface AuthenticatedResponse {
  status: string;
  user: User;
}
interface ErrorResponse {
  error: string;
}

const sendGoogleSignInToken = async (
  credentialResponse: CredentialResponse
): Promise<AuthenticatedResponse> => {
  try {
    const response = await axiosPrivate.post<AuthenticatedResponse>(
      "/user_bp/api_0/auth/google-sign-in",
      {
        credential: credentialResponse.credential,
        clientId: credentialResponse.clientId,
      },
      {
        withCredentials: true,
        headers: {
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      logger.log("Login successful:", response.data);

      return response.data;
    } else {
      throw new Error("Authentication failed. No further details provided.");
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError?.response != null) {
      logger.error("Login failed:", axiosError.response.data);
      throw new Error("Authentication failed. No further details provided.");
    } else {
      logger.error(
        "An unknown error occurred while sending token to backend:",
        error
      );
      throw new Error("An unknown error occurred");
    }
  }
};

export { sendGoogleSignInToken };
