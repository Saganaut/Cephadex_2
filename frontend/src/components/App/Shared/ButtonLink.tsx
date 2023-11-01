import React from "react";

interface ButtonLinkProps {
  children: React.ReactNode;
}
const ButtonLink: React.FC<ButtonLinkProps> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center  rounded-full bg-gray-200 px-4 py-2  text-sm text-black hover:bg-electric-violet hover:text-white">
        {children}
      </div>
    </div>
  );
};

const ButtonLinkSecondary: React.FC<ButtonLinkProps> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center  rounded-full bg-aquamarine px-4 py-2 text-sm text-black hover:bg-electric-violet hover:text-white">
        {children}
      </div>
    </div>
  );
};

export { ButtonLink };
export { ButtonLinkSecondary };
