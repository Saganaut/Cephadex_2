import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { type Group } from "@source/types/Group";
import { CardStructure } from "@source/components/App/Shared/CardStructure";
interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps): ReactElement => {
  return (
    <div>
      <CardStructure>
        <div className=" mb-5 border border-aquamarine rounded-lg p-5">
          <h4 className="text-2xl">{group.name} </h4>
          <p>Id: {group.id}</p>
        </div>

        <div className=" border border-blaze-orange rounded-xl p-5"></div>
        <div className=" mt-3">Data:</div>
      </CardStructure>
    </div>
  );
};

export { GroupCard };
