import { removeOneDeckFromGroup } from "@source/lib/store/group/actions";
import { useAppDispatch } from "@source/lib/store/hooks";

const useDeleteDeckFromGroup = () => {
  const dispatch = useAppDispatch();

  const deleteDeckFromGroup = async (
    groupId: number,
    deckId: number
  ): Promise<void> => {
    await dispatch(removeOneDeckFromGroup({ groupId, deckId }));
  };

  return deleteDeckFromGroup;
};

export { useDeleteDeckFromGroup };
