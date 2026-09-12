import CephaLogoOne from "@assets/logos/CephaLogoOne.png";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { SignInModal } from "@source/common/Modals/SignInModal";
import { useModal } from "@source/lib/contexts/ModalContext";
import React from "react";

const LoginPage: React.FC = () => {
  const { openSignInModal } = useModal();
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col bg-tolopea">
      <div className="flex justify-start ">
        <img src={CephaLogoOne} alt="Cepha Logo" className=" h-[50px] p-2 " />
      </div>
      <div className="flex grow flex-col items-center justify-center ">
        {" "}
        <h1 className="text-xl text-blaze-orange pb-10">
          {" "}
          You need to login to access this page{" "}
        </h1>
        <StyledButton
          label="Login"
          onClick={() => {
            openSignInModal("login");
          }}
        />
      </div>{" "}
      <SignInModal />
    </div>
  );
};

export { LoginPage };
