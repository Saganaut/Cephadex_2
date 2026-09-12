import CephaLogoOne from "@assets/logos/CephaLogoOne.png";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { Crickets } from "@source/common/InfoComponents/Crickets";
import React from "react";

const UnknownPage: React.FC = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col bg-tolopea">
      <div className="flex justify-start ">
        <img src={CephaLogoOne} alt="Cepha Logo" className=" h-[50px] p-2 " />
      </div>

      <div className="flex grow flex-col items-center justify-center text-blaze-orange">
        {" "}
        <div className="max-h-[50vh] pb-10">
          <Crickets message="From what we can tell this page does not exist. Please check the URL and try again." />{" "}
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
};

export { UnknownPage };
