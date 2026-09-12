import { Button } from "@source/common/Buttons/Button";
// import { useDeckNotificationContext } from "@source/lib/contexts/DeckNotificationContext";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DeckReadyProps {
  deckReadyProps?: {
    deckId: string; // or whatever the type of deckId is
  };
  setIsMessageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeckReady: React.FC<DeckReadyProps> = ({
  deckReadyProps,
  setIsMessageModalOpen,
}) => {
  const navigate = useNavigate();
  const deckId = deckReadyProps?.deckId;

  const onClick = (): void => {
    setIsMessageModalOpen(false);
    navigate(`/deck/${deckId}`);
  };
  const closeModal = (): void => {
    setIsMessageModalOpen(false);
  };
  return (
    <>
      {" "}
      <>
        <div className="mt-2 flex justify-center text-blaze-orange">
          Your deck is ready!
        </div>
        <div className="flex justify-center dark:text-aquamarine text-tolopea">
          Do you want to go to your deck now?
        </div>
      </>
      <div className={"flex w-full justify-between gap-x-[60px] pt-[28px]"}>
        <Button onClick={closeModal} label="No thanks" />
        <Button label="Go to deck!" onClick={onClick} />
      </div>
    </>
  );
};

export { DeckReady };
