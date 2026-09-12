import { type GroupSchema } from "@source/client";
import { fetchGroups } from "@source/lib/store/groups/actions";
import { selectAllGroups } from "@source/lib/store/groups/groupsSlice";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { useEffect } from "react";

const useFetchGroups = (): {
  groups: GroupSchema[];
  groupsStatus: "idle" | "loading" | "succeeded" | "failed";
} => {
  const groupsStatus = useAppSelector((state) => state.groups.status);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (groupsStatus === "succeeded") {
      return;
    }
    if (groupsStatus === "idle") {
      void dispatch(fetchGroups());
    }
  }, [groupsStatus, dispatch]);

  const groups = useAppSelector(selectAllGroups);

  return { groups, groupsStatus };
};

export { useFetchGroups };
