import DeckIcon from "@assets/DeckIcon.svg";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";
import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";

const DeckCard = (): ReactElement => {
  return (
    <Link to={"/study/deck/23"}>
      <div
        className={"flex w-full rounded-[10px] bg-tolopea px-[16px] py-[10px]"}
      >
        {/*   Icon */}
        <img src={DeckIcon} alt="icon" className={"h-[58px] w-[58px]"} />
        {/*   Info */}
        <div className={"w-full pl-[15px]"}>
          <h1
            className={
              "border-b-[1px] border-white text-[14px] font-bold text-white"
            }
          >
            Card title
          </h1>
          <p className={"pt-1 text-[11px] font-medium text-white"}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
          <span
            className={
              "mr-auto block py-1 text-right text-[9px] text-aquamarine"
            }
          >
            20h 10min
          </span>
        </div>

        {/*   Icon */}
        <EllipsisVerticalIcon className={"h-[24px] w-[24px] text-white"} />
      </div>
    </Link>
  );
};
export { DeckCard };
