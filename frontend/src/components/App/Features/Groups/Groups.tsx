import React, { type ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { type Group } from "@source/types/Group";
import { GroupCard } from "./GroupCard";
import { fetchGroupsThunk } from "@services/Api/Group/GroupApiThunks";

const Groups = (): ReactElement => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchGroupsThunk());
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-wrap mt-40">
        {groups.groups.length === 0 ? (
          <div>Loading...</div>
        ) : (
          groups.groups.map((group) => (
            <div key={group.id} className="m-2">
              <GroupCard group={group} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export { Groups };
