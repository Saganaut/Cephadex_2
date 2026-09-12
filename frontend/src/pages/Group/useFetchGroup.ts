import { selectGroupById } from "@source/lib/store/group/groupSlice";
import { fetchGroup } from "@store/group/actions";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect } from "react";

const useFetchGroup = (groupId: string | undefined) => {
  const dispatch = useAppDispatch();
  const group = useAppSelector((state) =>
    selectGroupById(state, groupId || "")
  );
  const groupStatus = useAppSelector((state) => state.group.status);

  useEffect(() => {
    if (group == null) {
      void dispatch(fetchGroup(Number(groupId)));
    }
  }, [dispatch, groupId, groupStatus, group]);

  return {
    group,
  };
};

export { useFetchGroup };
