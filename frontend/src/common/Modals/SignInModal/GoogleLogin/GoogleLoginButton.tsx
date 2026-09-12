import { useModal } from "@contexts/ModalContext";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { unwrapResult } from "@reduxjs/toolkit";
import { UserService } from "@source/client";
import { useAppDispatch } from "@source/lib/store/hooks";
import { checkUserAuth } from "@source/lib/store/user/actions";
import { ErrorPage } from "@source/pages/UtilityPages/ErrorPage";
import React, { type ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = (): ReactElement => {
  const navigate = useNavigate();
  const { closeSignInModal } = useModal();
  const dispatch = useAppDispatch();
  const originalPage = window.location.pathname;
  const [error, setError] = useState<Error | null>(null);

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    if (credentialResponse.credential == null) {
      return;
    }
    try {
      const response = await UserService.googleSignIn({
        credential: credentialResponse.credential,
        state: originalPage,
      });
      if (response.status === "success") {
        const resultAction = await dispatch(checkUserAuth());
        unwrapResult(resultAction);

        closeSignInModal();

        navigate(originalPage ?? "/");
      } else if (response.message === "User not registered") {
        navigate("/register", {
          state: {
            userInfo: response.userInfo,
            originalPage,
          },
        });
        closeSignInModal();
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);
    }
  };
  if (error !== null) {
    return <ErrorPage error={error} />;
  }
  return (
    <div className=" flex h-[44px] w-[266px] justify-center overflow-hidden rounded-full border-[1px] border-black bg-white px-6">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          void handleGoogleLogin(credentialResponse);
        }}
        useOneTap
        theme={"outline"}
        shape={"pill"}
        type={"standard"}
        size="large"
        logo_alignment="center"
        width="266px"
        containerProps={{
          className: "my-google-button-container",
          style: {
            border: "0",
            backgroundColor: "transparent",
            justifyContent: "between",
            font: "16px",
            height: "100%",
            boxShadow: "none",
          },
        }}
      />
    </div>
  );
};

export { GoogleLoginButton };
