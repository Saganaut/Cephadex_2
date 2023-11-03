import { useModal } from "@contexts/ModalContext";
import { useUser } from "@contexts/UserContext";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { sendGoogleSignInToken } from "@services/Auth";
import React, { type ReactElement } from "react";

const GoogleLoginButton = (): ReactElement => {
  const { setUserData } = useUser();
  const { closeSignInModal } = useModal();

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    try {
      const response = await sendGoogleSignInToken(credentialResponse);
      console.log("response", response);
      if (response.status === "authenticated") {
        // Update the user context with the user data from the response
        setUserData(response.user);
        const userData = response.user;
        setUserData(userData);
        closeSignInModal();
        console.log("Login successful:", response.user);
      } else {
        console.error("Login failed:", response);
      }
    } catch (error) {
      setUserData({
        "user-id": "0",
        username: "guest",
        email: "XXXXXXXXXXXXXXX",
      });
      console.error("An error occurred while sending token to backend:", error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleLogin} // Use the async function as the callback
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
      />
    </div>
  );
};

export { GoogleLoginButton };
