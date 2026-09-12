import React from "react";

interface IconButtonWrapperProps {
  children: React.ReactNode;
}
const IconButtonWrapper: React.FC<IconButtonWrapperProps> = ({ children }) => {
  return <div>{children}</div>;
};

export { IconButtonWrapper };
