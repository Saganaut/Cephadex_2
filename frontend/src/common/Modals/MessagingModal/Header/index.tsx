import React from "react";

interface HeaderProps {
  img: string;
  title: string;
}
const Header: React.FC<HeaderProps> = ({ img, title }) => {
  return (
    <>
      <div className="flex justify-center">
        <img
          src={img}
          alt="Cepha Deck Ready"
          className=" max-h-[100px] max-w-[100px] rounded-full"
        />
      </div>

      <div className="mt-2 flex justify-center text-blaze-orange">{title}</div>
    </>
  );
};

export { Header };
