import type { DeckSchema } from "@source/client";
import { selectGroupById } from "@source/lib/store/group/groupSlice";
import { addDecksToGroup, inviteUsersToGroup } from "@store/group/actions";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchGroup } from "./useFetchGroup";

export const sortOptions = [
  {
    value: 0,
    label: "Date",
  },
  {
    value: 1,
    label: "Name",
  },
];

const useGroup = (): {
  group: ReturnType<typeof selectGroupById>;
  groupStatus: string;
  deckSearchQuery: string;
  setDeckSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortValue: { value: number; label: string };
  setSortValue: React.Dispatch<
    React.SetStateAction<{ value: number; label: string }>
  >;
  sortedArray: DeckSchema[] | undefined;
  setSortedArray: React.Dispatch<
    React.SetStateAction<DeckSchema[] | undefined>
  >;
  memberModalIsOpen: boolean;
  setMemberModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deckModalIsOpen: boolean;
  setDeckModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  permissionModalIsOpen: boolean;
  setPermissionModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editModalIsOpen: boolean;
  setEditModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectedDecks: (decks: any) => void;
  handleSelectedUsers: (users: any, emails: any) => void;
  permission: string;
} => {
  const { groupId } = useParams<{ groupId: string }>();
  const dispatch = useAppDispatch();
  const [deckSearchQuery, setDeckSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState(sortOptions[0]);
  const [sortedArray, setSortedArray] = useState<DeckSchema[]>();
  const groupStatus = useAppSelector((state) => state.group.status);
  const [memberModalIsOpen, setMemberModalIsOpen] = useState(false);
  const [deckModalIsOpen, setDeckModalIsOpen] = useState(false);
  const [permissionModalIsOpen, setPermissionModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const { group } = useFetchGroup(groupId);

  const permission = group?.group?.permissions || "";

  const handleSelectedUsers = (users: any, emails: any): void => {
    void dispatch(
      inviteUsersToGroup({
        groupId: Number(groupId),
        invitees: users,
        emails,
      })
    );
  };

  const handleSelectedDecks = (decks: any): void => {
    void dispatch(addDecksToGroup({ groupId: Number(groupId), decks }));
  };

  return {
    group,
    groupStatus,
    deckSearchQuery,
    setDeckSearchQuery,
    sortValue,
    setSortValue,
    sortedArray,
    setSortedArray,
    memberModalIsOpen,
    setMemberModalIsOpen,
    deckModalIsOpen,
    setDeckModalIsOpen,
    permissionModalIsOpen,
    setPermissionModalIsOpen,
    editModalIsOpen,
    setEditModalIsOpen,
    handleSelectedDecks,
    handleSelectedUsers,
    permission,
  };
};

export { useGroup };
