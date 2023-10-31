import { useUser } from "@contexts/UserContext";
import React, { type ReactElement } from "react";

const CardAvatar = (): ReactElement => {
  const { user } = useUser();

  return (
    <>
      <img
        src="/assets/cephadex-logo-6.png"
        alt="Profile"
        className="h-40 w-40 rounded-full border-4 border-purple-600 bg-electric-violet-300 p-1"
      />
      <span className="absolute bottom-1  translate-x-10 translate-y-1/2  ">
        Edit
        <svg className="h-5 w-5 text-white"></svg>
      </span>
    </>
  );
};

export { CardAvatar };
