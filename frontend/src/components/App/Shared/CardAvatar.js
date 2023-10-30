import React from "react";
import { useUser } from "contexts/UserContext";

const CardAvatar = () => {
  const { user } = useUser();

  return (
    <>
      <img
        src="/assets/cephadex-logo-6.png"
        alt="Profile"
        className="w-40 h-40 rounded-full bg-electric-violet-300 border-4 border-purple-600 p-1"
      />
      <span className="absolute bottom-1  translate-y-1/2 translate-x-10  ">
        Edit
        <svg className="w-5 h-5 text-white"></svg>
      </span>
    </>
  );
};

export { CardAvatar };
