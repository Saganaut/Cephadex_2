import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";

const Groups = (): ReactElement => {
  const dashboardCardsData = useAppSelector((state) => state.dashboardCards);

  const groups = dashboardCardsData.filter((card) => card.type === "Group");

  return (
    <div>
      <div className="flex flex-wrap">
        {groups == null ? (
          <div>Loading...</div>
        ) : (
          groups.map((card, index) => (
            <div key={index} className="m-2">
              <GroupCard card={card} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { Groups };
