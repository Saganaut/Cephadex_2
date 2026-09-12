import { type DeckSchema } from "@source/client";
import React from "react";
import { CiCreditCard1 } from "react-icons/ci";

import { CardTag } from "./CardTag";

interface DeckBodyProps {
  data: DeckSchema;
}
const DeckBody: React.FC<DeckBodyProps> = ({ data }) => {
  return (
    <>
      {" "}
      <>
        <div className={"w-full rounded-[14px] bg-mariana-blue-100 p-[8px]"}>
          <div
            className={
              "flex items-center gap-x-[8px] rounded-[14px] bg-electric-violet px-[14px] py-[10px]"
            }
          >
            <CiCreditCard1 className={"text-[20px] text-white"} />
            <p className={"font-semibold"}>Cards</p>
          </div>
          <div
            className={
              "mt-[12px] flex flex-wrap items-center gap-x-[8px] gap-y-[12px]"
            }
          >
            <CardTag label={"Cards"} value={`${data.qtyCards?.toString()}`} />
            <CardTag
              label={"Mastered"}
              value={`${data.qtyCardsMastered?.toString()}`}
            />
            <CardTag
              label={"New"}
              value={data.qtyNewCards?.toString() ?? "0"}
            />
            <CardTag
              label={"Learning"}
              value={data.qtyCardsLearning?.toString() ?? "0"}
            />
          </div>
        </div>
      </>
    </>
  );
};

export { DeckBody };
