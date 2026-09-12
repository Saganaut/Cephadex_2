/** Deck Image \
 * Used to display either general deck icon, or custom AI generated image.
 * Currently disabled
 *
 * TODO:
 * - Re-enable custom images when feature is reset + S3 pre-signed URLs are fixed
 * **/

import DeckIcon from "@assets/DeckIcon.svg";
import React from "react";

interface DeckImgProps {
  img: string | null | undefined;
}
// eslint-disable-next-line no-unused-vars
const DeckImg: React.FC<DeckImgProps> = ({ img }) => {
  return (
    // <>
    //   {" "}
    //   {img != null && img !== "None" ? (
    //     <img
    //       src={img}
    //       alt='icon'
    //       className={"size-[58px] rounded-full border-2 border-aquamarine"}
    //     />
    //   ) : (
    //     <img
    //       src={DeckIcon}
    //       alt='icon'
    //       className={"size-[58px] rounded-full border-2 border-aquamarine"}
    //     />
    //   )}
    // </>
    <img
      src={DeckIcon}
      alt='icon'
      className={"size-[58px] rounded-full border-2 border-aquamarine"}
    />
  );
};

export { DeckImg };
