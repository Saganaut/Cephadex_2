import CephaLogoOne from "@assets/logos/CephaLogoOne.png";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { SpeakingCeph } from "@source/common/SpeakingCeph";
import { NewsletterSignUpForm } from "@source/pages/LandingPage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpForm";
import React, { type ReactElement } from "react";
import { useLocation } from "react-router-dom";

export default function NewsLetter(): ReactElement {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const value = queryParams.get("value");
  const text =
    value === "unsubscribe"
      ? "We're sorry to see you go. Please enter your email address to unsubscribe from our newsletter."
      : "Join our community and get the latest updates!";

  const type = value === "unsubscribe" ? "sad" : "happy";

  return (
    <div className="flex h-[100vh] w-[100vw] flex-col bg-tolopea">
      <div className="flex justify-start ">
        <img src={CephaLogoOne} alt="Cepha Logo" className=" h-[50px] p-2 " />
      </div>

      <div className="flex grow flex-col items-center justify-center ">
        {" "}
        <div className="pb-14">
          <SpeakingCeph text={text} type={type} />
        </div>
        <h1 className="pb-4 text-center text-2xl text-blaze-orange">
          {value === "unsubscribe"
            ? "Unsubscribe from our "
            : "Subscribe to our "}
          Newsletter
        </h1>
        <div className="max-w-[500px] pb-10">
          {value === "unsubscribe" ? (
            <NewsletterSignUpForm value="unsubscribe" />
          ) : (
            <NewsletterSignUpForm />
          )}
        </div>
        <StyledButton
          label="Back to Home"
          onClick={() => {
            window.location.replace("/");
          }}
        />
      </div>
    </div>
  );
}
