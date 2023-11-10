import React, { type ReactElement } from "react";
import { useModal } from "@contexts/ModalContext";
import { sendGoogleSignInToken } from "@services/Auth";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUser } from "@store/userSlice";
import { logger } from "@utils/Logger";

const GoogleLoginButton = (): ReactElement => {
  const { closeSignInModal } = useModal();
  const dispatch = useDispatch();
  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    try {
      const response = await sendGoogleSignInToken(credentialResponse);

      if (response.status === "success") {
        dispatch(setUser(response.user));
        closeSignInModal();
        logger.log("Login successful:", response.user);
      } else {
        logger.error("Login failed:", response);
      }
    } catch (error) {
      dispatch(
        setUser({
          "user-id": "0",
          username: "guest",
          email: "XXXXXXXXXXXXXXX",
        })
      );
      logger.error("An error occurred while sending token to backend:", error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          void handleGoogleLogin(credentialResponse);
        }}
        onError={() => {
          logger.error("Login Failed");
        }}
        useOneTap
      />
    </div>
  );
};

export { GoogleLoginButton };
