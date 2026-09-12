import GroupOctopusIcon from "@assets/GroupOctopusIcon.svg";
import { Filter } from "@common/Form/Filter";
import { PageHeader } from "@common/PageHeader";
import { PageWrapper } from "@common/PageWrapper";
import type { GroupSchema } from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { useFetchGroups } from "@source/lib/hooks/groupHooks/useFetchgroups";
import React, { type ReactElement, useState } from "react";

import { CreateGroupModal } from "./components/CreateGroup/CreateGroupModal";
import { SelectAGroup } from "./components/SelectGroup";

const Groups = (): ReactElement => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  const { groups, groupsStatus } = useFetchGroups();

  const Details = (): ReactElement => {
    return (
      <>
        <div className={"mt-[18px] flex items-center gap-x-[20px]"}>
          {groups.length > 0 && (
            <p
              className={`rounded-full ${
                groups.length > 1
                  ? "bg-electric-violet-700 dark:bg-mariana-blue-100"
                  : "bg-electric-violet-700"
              } px-[20px] py-[4px] font-medium text-white`}
            >
              {groups.length} {groups.length > 1 ? "groups" : "group"}
            </p>
          )}
        </div>
        <div className={"mt-[32px] flex items-center gap-x-[12px]"}>
          <Button
            label="New Group"
            onClick={() => {
              setCreateModalIsOpen(true);
            }}
          />
        </div>
      </>
    );
  };

  return (
    <PageWrapper>
      <CreateGroupModal
        isOpen={createModalIsOpen}
        setIsOpen={setCreateModalIsOpen}
      />

      <PageHeader
        title={"My groups"}
        subtitle={"Because we all need a little help from our friends"}
        description={""}
        CustomDetails={Details}
        img={GroupOctopusIcon}
        type="withImage"
      />

      <SelectAGroup
        onGroupClick={() => {}}
        groups={groups}
        groupsStatus={groupsStatus}
        setCreateModalIsOpen={setCreateModalIsOpen}
      />
    </PageWrapper>
  );
};

export default Groups;
