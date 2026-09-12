import MSIcon from "@assets/signin/MSIcon.png";
import React from "react";

// import MsSignInLight from "./assets/MsSignInLight.svg?url";

const MICROSOFT_REDIRECT_URI = import.meta.env.VITE_MICROSOFT_REDIRECT_URI;
const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
const VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const MSLoginButton = (): React.ReactNode => {
  if (
    VITE_APP_BASE_URL.length === 0 ||
    MICROSOFT_REDIRECT_URI.length === 0 ||
    MICROSOFT_CLIENT_ID.length === 0
  ) {
    console.error("Microsoft OAuth configuration is missing.");
    return <div>Error: Microsoft OAuth configuration is missing.</div>;
  }

  const fullMicrosoftRedirectUri = `${VITE_APP_BASE_URL}${MICROSOFT_REDIRECT_URI}`;

  const handleMicrosoftLogin = (): void => {
    const originalPage = window.location.pathname;
    const state = encodeURIComponent(originalPage);
    const microsoftAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MICROSOFT_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      fullMicrosoftRedirectUri
    )}&response_type=code&scope=openid%20profile%20email%20User.Read&state=${encodeURIComponent(
      state
    )}`;
    window.location.href = microsoftAuthUrl;
  };

  return (
    <button
      className=' flex w-[266px] items-center rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      onClick={handleMicrosoftLogin}>
      <div className='flex items-center justify-between gap-2 text-slate-700'>
        <img
          src={MSIcon}
          alt='Microsoft'
          className='microsoft-logo rounded-full'
        />
        <p> Sign in with Microsoft</p>
      </div>
    </button>
  );
};

export { MSLoginButton };
