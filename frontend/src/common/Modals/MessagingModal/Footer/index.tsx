import { Button } from "@source/common/Buttons/Button";
import React from "react";

interface FooterProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const Footer: React.FC<FooterProps> = ({ setIsOpen }) => {
  return (
    <>
      <div className="mt-4 flex justify-center">
        <Button
          className=" px-4 py-2 "
          onClick={() => {
            setIsOpen(false);
          }}
          label="Close"
        />
      </div>
    </>
  );
};

export { Footer };
