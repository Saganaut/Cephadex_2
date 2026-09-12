import registerSideImg1 from "@pages/Register/assets/registerSideImg1.png";
import { RegisterStepFive } from "@pages/Register/RegisterStepFive";
import { RegisterStepFour } from "@pages/Register/RegisterStepFour";
import { RegisterStepOne } from "@pages/Register/RegisterStepOne";
import { RegisterStepThree } from "@pages/Register/RegisterStepThree";
import { RegisterStepTwo } from "@pages/Register/RegisterStepTwo";
import { SpeakingCeph } from "@source/common/SpeakingCeph";
import { useAppDispatch } from "@source/lib/store/hooks";
import { setFieldValues } from "@source/lib/store/register/registerSlice";
import React, { type ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Register(): ReactElement {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let userInfo = location.state != null ? location.state.userInfo : null;
  let originalPage =
    location.state != null ? location.state.originalPage : null;

  const notRegisteredMessage = location.state != null;
  const [step, setStep] = useState(1);
  const [speech, setSpeech] = useState("Welcome to the registration page!");
  if (originalPage == null) {
    originalPage = searchParams.get("originalPage");
  }

  if (userInfo === null) {
    userInfo = {
      token: searchParams.get("token"),
      firstName: searchParams.get("firstName"),
      lastName: searchParams.get("lastName"),
      email: searchParams.get("email"),
      picture: searchParams.get("picture"),
      externalType: searchParams.get("externalType"),
    };
  }
  if (userInfo !== null) {
    dispatch(
      setFieldValues({
        token: userInfo.token ?? "",
        firstName: userInfo.firstName ?? "",
        lastName: userInfo.lastName ?? "",
        email: userInfo.email ?? "",
        picture: userInfo.picture ?? "",
        externalType: userInfo.externalType ?? "",
      })
    );
  }
  useEffect(() => {
    if (userInfo != null) {
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // this must be left blank.

  return (
    <div className="flex h-screen">
      <div
        className="hidden flex-1 bg-cover bg-center  bg-no-repeat md:block"
        style={{ backgroundImage: `url(${registerSideImg1})` }}
      ></div>
      <div className="flex  flex-1 items-center justify-center bg-mariana-blue p-2">
        <div className="max-h-[800px] w-full max-w-[600px]">
          <div className="mt-20 flex h-[25vh] w-full justify-start">
            <SpeakingCeph type="default" text={speech} />
          </div>
          {step === 1 && <RegisterStepOne />}
          {step === 2 && (
            <RegisterStepTwo
              notRegisteredMessage={notRegisteredMessage}
              setStep={setStep}
              setSpeech={setSpeech}
            />
          )}
          {step === 3 && (
            <RegisterStepThree setStep={setStep} setSpeech={setSpeech} />
          )}
          {step === 4 && (
            <RegisterStepFour setStep={setStep} setSpeech={setSpeech} />
          )}
          {step === 5 && (
            <RegisterStepFive
              originalPage={originalPage}
              setSpeech={setSpeech}
            />
          )}
        </div>
      </div>
    </div>
  );
}
