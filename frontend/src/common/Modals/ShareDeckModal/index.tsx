import ShareIcon from "@assets/cardMenuIcons/ShareIcon.svg?react";
import PencilSquareIcon from "@assets/PencilSquareIcon.svg?react";
import QrCodeIcon from "@assets/QrCodeIcon.svg?react";
import { ModalWrapper } from "@source/common/Modals/ModalWrapper";
import { SharerStandard } from "@source/common/Sharing";
import { useDeckContexts } from "@source/lib/contexts/DeckContexts";
import React from "react";

const options: Array<{ label: string; value: string; icon?: any }> = [
  {
    label: "By email",
    value: "email",
    icon: <PencilSquareIcon stroke="white" />,
  },
  {
    label: "Link & QR",
    value: "linkqr",
    icon: <QrCodeIcon />,
  },
  {
    label: "Socials",
    value: "socials",
    icon: <ShareIcon className="fill-white text-white" />,
  },
];

const ShareDeckModal: React.FC = () => {
  const { isShareDeckModalOpen, setIsShareDeckModalOpen, deckId } =
    useDeckContexts();

  const [activeIndex, setActiveIndex] = React.useState(0);

  // const handleCloseModal = (): void => {
  //   setIsShareDeckModalOpen(false);
  // };
  return (
    <>
      <ModalWrapper
        isOpen={isShareDeckModalOpen}
        setIsOpen={setIsShareDeckModalOpen}
      >
        <div className={"mx-auto rounded-2xl   sm:p-10 lg:mt-[64px]"}>
          <div className="flex justify-evenly p-2">
            <SharerStandard
              setActiveIndex={setActiveIndex}
              activeIndex={activeIndex}
              options={options}
              type="deck"
              itemId={deckId}
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export { ShareDeckModal };
