import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchAllGroups } from "@source/services/Api/Group/GroupApi";
import { type Group } from "@source/types/Group";
import { GroupCard } from "./GroupCard";

const Groups = (): ReactElement => {
  const dispatch = useAppDispatch();
  const groupsData = useAppSelector((state) =>
    state.dashboardCards.filter((card) => card.type === "Group")
  ) as Group[];
  const [groupCards, setGroupCards] = useState<Group[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (groupsData.length === 0) {
        const groups = await fetchAllGroups();
        setGroupCards(groups);
      } else {
        setGroupCards(groupsData);
      }
    };

    fetchData();
  }, [groupsData, dispatch]);

  return (
    <>
      <div className="flex flex-wrap mt-40">
        {groupCards.length === 0 ? (
          <div>Loading...</div>
        ) : (
          groupCards.map((group) => (
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
