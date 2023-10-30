import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { sendGoogleSignInToken } from "../../../services/Auth";
import { useUser } from "../../../contexts/UserContext";
import { useModal } from "../../../contexts/ModalContext";

const GoogleLoginButton = () => {
  const { setUserData } = useUser();
  const { closeSignInModal } = useModal();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log(credentialResponse);
      const response = await sendGoogleSignInToken(credentialResponse);

      if (response.data.status === "success") {
        // Update the user context with the user data from the response
        setUserData(response.data.user);
        const userData = response.data["user"];
        setUserData(userData);
        closeSignInModal();
        console.log("Login successful:", response.data);
      } else {
        console.error("Login failed:", response.data.error);
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
