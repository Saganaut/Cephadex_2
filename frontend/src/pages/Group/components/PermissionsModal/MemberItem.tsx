import { type GroupMemberSchema } from "@client/models/GroupMemberSchema";
import { type PermissionChange } from "@source/client";
import { Dropdown } from "@source/common/Form/Dropdown";
import React, { useEffect, useState } from "react";

const roleOptions = [
  {
    value: 0,
    label: "Member",
  },
  {
    value: 1,
    label: "Admin",
  },
];

const permissionsOptions = [
  {
    value: 0,
    label: "Read",
  },
  {
    value: 1,
    label: "Write",
  },
];

interface MemberItemProps {
  member: GroupMemberSchema;
  updatedPermissions: PermissionChange[];
  setUpdatedPermissions: React.Dispatch<
    React.SetStateAction<PermissionChange[]>
  >;
}

const MemberItem: React.FC<MemberItemProps> = ({
  member,
  updatedPermissions,
  setUpdatedPermissions,
}) => {
  const [selectedRoleOption, setSelectedRoleOption] = useState(
    roleOptions.find(
      (option) => option.label.toLowerCase() === member.groupRole
    )
  );
  const [selectedPermissionsOption, setSelectedPermissionsOption] = useState(
    permissionsOptions.find(
      (option) => option.label.toLowerCase() === member.permissions
    )
  );
  const updateUserPermissions = () => {
    setUpdatedPermissions((prevState) => {
      const userExists = prevState.some(
        (updatedPermissions) => updatedPermissions.id === member.id
      );
      if (userExists) {
        return prevState.map((updatedPermissions) =>
          updatedPermissions.id === member.id
            ? {
                id: member.id,
                role: selectedRoleOption?.label.toLowerCase(),
                permissions: selectedPermissionsOption?.label.toLowerCase(),
              }
            : updatedPermissions
        );
      } else {
        return [
          ...prevState,
          {
            id: member.id,
            role: selectedRoleOption?.label.toLowerCase(),
            permissions: selectedPermissionsOption?.label.toLowerCase(),
          },
        ];
      }
    });
  };
  useEffect(() => {
    updateUserPermissions();
  }, [selectedRoleOption, selectedPermissionsOption, updateUserPermissions]);

  const handleRoleChange = (
    value: { value: number; label: string } | { value: any }
  ): void => {
    setSelectedRoleOption(value);
  };

  const handlePermissionChange = (
    value: { value: number; label: string } | { value: any }
  ): void => {
    setSelectedPermissionsOption(value);
  };

  return (
    <>
      <div className="rounded-2xl bg-electric-violet p-1 text-white">
        <div className="flex justify-evenly">
          <div className="self-center">
            <h1>{member.username}</h1>
          </div>
          <div className="max-w-[150px] p-1">
            <Dropdown
              name="groupRole"
              options={roleOptions}
              value={selectedRoleOption}
              onChange={handleRoleChange}
              style="sort"
            />
          </div>{" "}
          <div className="max-w-[150px]  p-1">
            <Dropdown
              name="permissions"
              options={permissionsOptions}
              value={selectedPermissionsOption}
              onChange={handlePermissionChange}
              style="sort"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { MemberItem };
