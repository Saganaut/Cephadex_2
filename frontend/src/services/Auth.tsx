import { type CredentialResponse } from "@react-oauth/google";
import { axiosPrivate } from "@services/axios";
import { type AxiosResponse } from "axios";

const sendGoogleSignInToken = async (
  credentialResponse: CredentialResponse
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axiosPrivate.post(
      "/user_bp/api_0/auth/google-sign-in",
      credentialResponse,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.status === "success") {
      console.log("Login successful:", response.data);
      return response;
    } else {
      console.error("Login failed:", response.data.error);
      return response;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
    return "error" as any;
  }
};

export { sendGoogleSignInToken };
