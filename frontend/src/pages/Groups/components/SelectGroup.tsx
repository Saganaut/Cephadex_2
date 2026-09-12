import { type GroupSchema } from "@source/client";
import { GroupCard } from "@source/common/Cards/GroupCard/GroupCard";
import { Loading } from "@source/common/InfoComponents/Loading";
import { SelectWrapper } from "@source/common/SelectWrapper";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface SelectAGroupProps {
  onGroupClick: (args?: any) => void;
  groupsStatus: string;
  groups: GroupSchema[];
  setCreateModalIsOpen: (val: boolean) => void;
}
const sortOptions = [
  {
    value: 0,
    label: "Date",
  },
  {
    value: 1,
    label: "Name",
  },
];
const SelectAGroup: React.FC<SelectAGroupProps> = ({
  groupsStatus,
  groups,
  onGroupClick,
  setCreateModalIsOpen,
}) => {
  const [sortValue, setSortValue] = useState<{ value: number; label: string }>(
    sortOptions[0]
  );
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [sortedArray, setSortedArray] = useState<GroupSchema[]>();

  if (groupsStatus === "loading")
    return (
      <>
        <Loading />
      </>
    );

  return (
    <SelectWrapper
      title="Select a group"
      searchPlaceHolder={"Search for groups"}
      dataArray={groups}
      sortOptions={sortOptions}
      sortValue={sortValue}
      setSortValue={setSortValue}
      setSortedArray={setSortedArray}
      setFilterValue={setGroupSearchQuery}
      style="shallows"
      withFilter={true}
    >
      <div className={"w-full"}>
        <div
          className={
            "grid h-full w-full gap-y-[24px] pb-32 sm:pb-8 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          <AnimatePresence>
            {sortedArray
              ?.filter((group) =>
                group.name
                  .toUpperCase()
                  .includes(groupSearchQuery.toUpperCase())
              )
              .map((group, index) => (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ delay: 0.05 * index, ease: "easeOut" }}
                  onClick={() => {
                    onGroupClick(group);
                  }}
                  key={index}
                  className="mx-auto  w-full px-2"
                >
                  <Link to={`/group/${group.id}`}>
                    <GroupCard key={index} group={group} type="group" />
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
        {sortedArray != null && sortedArray?.length <= 0 && (
          <div className={"mx-auto text-center font-medium text-white"}>
            <p>
              You don&apos;t have any groups,{" "}
              <span
                className={"cursor-pointer text-aquamarine underline"}
                onClick={() => {
                  setCreateModalIsOpen(true);
                }}
              >
                create one now!
              </span>
            </p>
          </div>
        )}
      </div>
    </SelectWrapper>
  );
};
export { SelectAGroup };
