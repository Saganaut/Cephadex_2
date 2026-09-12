import useWindowResize from "@source/lib/hooks/useWindowResize";
import { truncate } from "@source/lib/utils/functions";
import React from "react";

const TRUNCATE_LENGTH = 100;
const TRUNCATE_LENGTH_LG = 120;
const TRUNCATE_LENGTH_SM = 40;
interface DeckDescriptionProps {
  description: string | null | undefined;
}
const DeckDescription: React.FC<DeckDescriptionProps> = ({ description }) => {
  const { width } = useWindowResize();

  const getTruncateLength = (): number => {
    switch (true) {
      case width < 420:
        return TRUNCATE_LENGTH_SM;
      case width > 1600:
        return TRUNCATE_LENGTH_LG;
      default:
        return TRUNCATE_LENGTH;
    }
  };

  return (
    <>
      {" "}
      <p
        className={"pt-1 text-[11px] font-medium text-tolopea dark:text-white"}>
        {description != null && truncate(description, getTruncateLength())}
      </p>
    </>
  );
};

export { DeckDescription };
