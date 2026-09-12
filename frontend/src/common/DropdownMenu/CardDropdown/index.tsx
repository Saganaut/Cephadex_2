import CopyIcon from "@assets/cardMenuIcons/CopyIcon.svg?react";
import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import StatsIcon from "@assets/cardMenuIcons/StatsIcon.svg?react";
import { DropdownMenu } from "@source/common/DropdownMenu";
import { EllipsisMenuButton } from "@source/common/DropdownMenu/components/EllipsisMenuButton";
import { DeleteCardModal } from "@source/common/Modals/DeleteConfirmationModal/DeleteCardModal";
import { useCardContext } from "@source/lib/contexts/CardContext";
import { selectCardsById } from "@source/lib/store/cards/cardsSlice";
import { useAppSelector } from "@source/lib/store/hooks";
import React, { useEffect } from "react";

interface CardDropdownProps {
  groupId?: number;
  deckId: number;
  cardId: number;
  type?:
    | "group"
    | "standard"
    | "simple"
    | "public"
    | "groupAdmin"
    | "full"
    | "card"
    | "private";
}
const CardDropdown: React.FC<CardDropdownProps> = ({
  groupId,
  deckId,
  type,
  cardId,
}) => {
  const card = useAppSelector((state) => selectCardsById(state, cardId)); // TODO how to handle this without an if statement?
  const { setIsCardStatModalOpen, setCard, setIsCardCopyModalOpen, setDeckId } =
    useCardContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  useEffect(() => {
    if (card != null) {
      setCard(card);
    }
    setDeckId(deckId);
  }, [card, deckId, setCard, setDeckId]);
  const handleStatsClick = (): void => {
    setIsCardStatModalOpen(true);
  };
  const handleDeleteCard = (): void => {
    setIsDeleteModalOpen(true);
  };

  const handleCopy = (): void => {
    setIsCardCopyModalOpen(true);
  };

  const links = [
    {
      label: "Stats",
      icon: StatsIcon,
      type: "",
      onClick: () => {
        handleStatsClick();
      },
    },

    {
      label: "Copy",
      type: "middle",
      icon: CopyIcon,
      onClick: () => {
        handleCopy();
      },
    },
    {
      label: "Delete",
      icon: DeleteIcon,
      type: "",
      onClick: () => {
        handleDeleteCard();
      },
    },
  ];

  return (
    <>
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DropdownMenu
          type="Card"
          button={<EllipsisMenuButton />}
          links={links}
        />
      </div>
      <DeleteCardModal
        type="Card"
        activeCard={card}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        deckId={String(deckId)}
      />
    </>
  );
};

export { CardDropdown };
