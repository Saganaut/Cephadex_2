import { type CredentialResponse } from "@react-oauth/google";
import { axiosPrivate } from "@services/axios";
import { type AxiosError } from "axios";

interface AuthenticatedResponse {
  status: string;
  user: any;
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
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "authenticated") {
      console.log("Login successful:", response.data);
      return response.data;
    } else {
      throw new Error("Authentication failed. No further details provided.");
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError?.response != null) {
      console.error("Login failed:", axiosError.response.data);
      throw new Error("Authentication failed. No further details provided.");
    } else {
      console.error(
        "An unknown error occurred while sending token to backend:",
        error
      );
      throw new Error("An unknown error occurred");
    }
  }
};

export { sendGoogleSignInToken };
