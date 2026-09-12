import EditIcon from "@assets/EditIcon.svg?react";
import UserAvatar from "@assets/UserAvatar.svg?react";
import { UploadPicModal } from "@common/Modals/UploadPicModal";
import React, { useState } from "react";

interface CardAvatarProps {
  pic: string | null | undefined;
}

const CardAvatar: React.FC<CardAvatarProps> = ({ pic }) => {
  const [uploadPicIsOpen, setUploadPicIsOpen] = useState(false);
  return (
    <>
      <UploadPicModal
        isOpen={uploadPicIsOpen}
        setIsOpen={setUploadPicIsOpen}
        pic={pic}
      />
      <div className={"relative"}>
        {pic === null || pic === "" || pic === undefined ? (
          <UserAvatar className={"h-[140px] w-[140px] rounded-full"} />
        ) : (
          <img
            src={pic}
            alt="Profile"
            className="h-[140px] w-[140px] rounded-full"
          />
        )}

        <EditIcon
          onClick={() => {
            setUploadPicIsOpen(true);
          }}
          className={
            "absolute bottom-0 right-0 h-[42px] w-[42px] cursor-pointer hover:scale-105"
          }
        />
      </div>
    </>
  );
};

export { CardAvatar };
