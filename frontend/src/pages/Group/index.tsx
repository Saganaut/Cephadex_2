import { PageHeader } from "@common/PageHeader";
import { PageWrapper } from "@common/PageWrapper";
import UserIcon from "@heroicons/react/20/solid/UserIcon";
import { Button } from "@source/common/Buttons/Button";
import { SwitchField } from "@source/common/Form/SwitchField";
import { ErrorMessage } from "@source/common/InfoComponents/ErrorMessage";
import { Loading } from "@source/common/InfoComponents/Loading";
import React, { type ReactElement, useState } from "react";
import { useParams } from "react-router-dom";

import { GroupDeckModal } from "./components/DeckModal";
import { EditGroupModal } from "./components/EditGroupModal";
import { GroupMemberModal } from "./components/MemberModal";
import { GroupPermissionsModal } from "./components/PermissionsModal";
import { GroupContent } from "./GroupContent";
import { MembersList } from "./Members";
import { sortOptions, useGroup } from "./useGroup";

// TODO fix the repetition of the Group Component
// TODO change reveal members button to a switch on small screens
const Group: React.FC = () => {
  const { groupId } = useParams();
  const [revealMembers, setRevealMembers] = useState(false);

  const {
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
    permission,
    handleSelectedDecks,
    handleSelectedUsers,
  } = useGroup();

  if (groupStatus === "loading") {
    return (
      <>
        <Loading />{" "}
      </>
    );
  }

  if (group == null) {
    return (
      <>
        <Loading />{" "}
      </>
    );
  }
  if (group.group.permissions == null) {
    return (
      <ErrorMessage message="You don't have permission to view this group" />
    );
  }
  if (groupId === undefined) {
    return <ErrorMessage />;
  }

  const Details = (): ReactElement => {
    return (
      <div className={"mt-[32px] flex items-center gap-x-[20px]"}>
        <div
          className={"flex flex-col items-center gap-x-[24px] px-2 md:flex-row"}
        >
          {/* <h1 className={"text-2xl font-semibold text-white"}>My Decks</h1> */}
          <button
            className="rounded-full bg-mariana-blue-100 px-[20px] py-[4px] font-medium text-white"
            onClick={() => {
              setDeckModalIsOpen(true);
            }}
          >
            + deck
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <UserIcon className="h-[30px] w-[30px] cursor-pointer  rounded-full border-2 border-white bg-mariana-blue text-white " />{" "}
            <SwitchField
              enabled={revealMembers}
              setEnabled={() => {
                setRevealMembers(!revealMembers);
              }}
            />
          </div>
        </div>
        {group.group.isPrivate === true ? (
          group.group.permissions === "write" && (
            <Button
              label={"Invite members"}
              onClick={() => {
                setMemberModalIsOpen(true);
              }}
            />
          )
        ) : (
          <Button
            label={"Invite members"}
            onClick={() => {
              setMemberModalIsOpen(true);
            }}
          />
        )}
        {/* <Button
          label={"Edit permissions"}
          onClick={() => {
            setPermissionModalIsOpen(true);
          }}
          className={"border-2 border-white bg-transparent"}
        /> */}
      </div>
    );
  };

  return (
    <PageWrapper>
      {permission === "write" && (
        <>
          <GroupDeckModal
            isOpen={deckModalIsOpen}
            setIsOpen={setDeckModalIsOpen}
            handleSelectedItems={handleSelectedDecks}
          />
          <GroupMemberModal
            isOpen={memberModalIsOpen}
            setIsOpen={setMemberModalIsOpen}
            handleSelectedItems={handleSelectedUsers}
          />
          {group.members != null && (
            <GroupPermissionsModal
              isOpen={permissionModalIsOpen}
              setIsOpen={setPermissionModalIsOpen}
              members={group.members}
              groupId={Number(group.group.id)}
            />
          )}
          <EditGroupModal
            isOpen={editModalIsOpen}
            setIsOpen={setEditModalIsOpen}
            group={group.group}
          />
        </>
      )}
      <PageHeader
        title={group.group.name}
        subtitle={group.group.type}
        CustomDetails={Details}
        img={group.group.img}
        type={"withImage"}
        onEdit={
          group.group.role === "creator"
            ? () => {
                setEditModalIsOpen(true);
              }
            : undefined
        }
      />
      <div className={"sm:justify-between md:flex md:gap-x-[24px]"}>
        <div className={"md:w-[80%]"}>
          {revealMembers ? (
            <div className="pb-8 md:hidden  md:w-[20%] md:px-2">
              {" "}
              <MembersList
                members={group.members}
                invites={group.invites}
                groupId={Number(group.group.id)}
                permission={permission}
                setPermissionModalIsOpen={setPermissionModalIsOpen}
              />
            </div>
          ) : (
            <div className=" md:hidden  ">
              <GroupContent
                sortedArray={sortedArray}
                deckSearchQuery={deckSearchQuery}
                groupId={Number(group.group.id)}
                permission={permission}
                dataArray={group.decks}
                sortOptions={sortOptions}
                sortValue={sortValue}
                setSortValue={setSortValue}
                setSortedArray={setSortedArray}
                setFilterValue={setDeckSearchQuery}
              />
            </div>
          )}
          <div className="hidden h-full md:block ">
            <GroupContent
              sortedArray={sortedArray}
              deckSearchQuery={deckSearchQuery}
              groupId={Number(group.group.id)}
              permission={permission}
              dataArray={group.decks}
              sortOptions={sortOptions}
              sortValue={sortValue}
              setSortValue={setSortValue}
              setSortedArray={setSortedArray}
              setFilterValue={setDeckSearchQuery}
            />
          </div>
        </div>

        <div className="hidden h-full md:block md:w-[20%]">
          <MembersList
            members={group.members}
            invites={group.invites}
            groupId={Number(group.group.id)}
            permission={permission}
            setPermissionModalIsOpen={setPermissionModalIsOpen}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Group;
