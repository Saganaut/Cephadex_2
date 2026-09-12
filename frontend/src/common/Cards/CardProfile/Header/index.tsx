import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";

interface HeaderProps {
  username: string;
}
const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <>
      {" "}
      <h1 className="text-2xl font-semibold">Hello! </h1>
      <h2 className="text-xl font-medium">
        <span>{username}</span>
      </h2>
    </>
  );
};

export { Header };
