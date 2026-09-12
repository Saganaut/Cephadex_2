import EditNoBorder from "@assets/EditNoBorder.svg?react";
import { DeckSchema } from "@source/client";
import { AddRelationshipModal } from "@source/common/Modals/AddRelationshipModal";
import {
  fetchDeckChildren,
  fetchDeckParents,
} from "@source/lib/store/decks/actions";
import {
  selectDeckById,
  selectDecksByIds,
} from "@source/lib/store/decks/decksSlice";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { type RootState } from "@source/lib/store/store";
import React, { useEffect } from "react";

import { RelationshipItem } from "./RelationshipItem";

interface RelationshipContainerProps {
  deckId: number;
  isCollapsed: boolean;
  childrenIds: number[];
  parentIds: number[];
}
const RelationshipContainer: React.FC<RelationshipContainerProps> = ({
  deckId,
  isCollapsed,
  childrenIds,
  parentIds,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const children = useAppSelector((state: RootState) =>
    selectDecksByIds(state, childrenIds)
  );

  const parents = useAppSelector((state: RootState) =>
    selectDecksByIds(state, parentIds)
  );
  useEffect(() => {
    if (childrenIds === null) {
      void dispatch(fetchDeckChildren(deckId));
    }
  }, [deckId, dispatch, childrenIds]);

  useEffect(() => {
    if (parentIds === null) {
      void dispatch(fetchDeckParents(deckId));
    }
  }, [deckId, dispatch, parentIds]);

  return (
    <>
      <div>
        <div
          className={"min-w-[200px] rounded-[18px] p-[10px] sm:min-w-[400px]"}
        >
          {" "}
          <div className="rounded-2xl  p-2">
            {!isCollapsed ? (
              <>
                <div className="flex items-center justify-between">
                  <h1 className={"mb-2 text-lg "}>Relationships</h1>{" "}
                  <EditNoBorder
                    className={"h-[25px] w-[25px] cursor-pointer  "}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  />
                </div>
                <div className={"mx-auto "}>
                  {children.map((child) => (
                    <RelationshipItem
                      key={child?.id}
                      deck={child}
                      type="child"
                      mainDeckId={deckId}
                    />
                  ))}
                  {parents.map((parent) => (
                    <RelationshipItem
                      key={parent?.id}
                      deck={parent}
                      type="parent"
                      mainDeckId={deckId}
                    />
                  ))}
                </div>
              </>
            ) : (
              <h1 className={"text-2xl "}>Ships</h1>
            )}
          </div>
        </div>
        <AddRelationshipModal
          childDeckId={deckId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </>
  );
};

export { RelationshipContainer };
