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
      if (response.status === "authenticated") {
        console.log("handleGoogleLogin Response", response.user);

        // Update the user context with the user data from the response
        setUserData(response.user);
        closeSignInModal();
        console.log("Login successful:", response.status);
      } else {
        console.error("Login failed:", response);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setUserData({
        id: 0,
        username: "guest",
        email: "XXXXXXXXXXXXXXX",
      });
      console.error("An error occurred while sending token to backend:", error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          void handleGoogleLogin(credentialResponse);
        }}
        onError={() => {
          console.error("Login Failed with error");
        }}
        useOneTap
      />
    </div>
  );
};

export { GoogleLoginButton };
