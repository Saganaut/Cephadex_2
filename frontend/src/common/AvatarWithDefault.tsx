import EditPenIcon from "@assets/EditPenIcon.svg?react";
import NewImage from "@assets/NewImage.svg?react";
import React, { FC } from "react";

const AvatarWithDefault: FC<{
  isMobile?: boolean;
  image: string | null;
  DefaultIcon: JSX.Element;
  setUploadImgOpen: (isOpen: boolean) => void;
  filename?: string;
}> = ({ isMobile, image, DefaultIcon, setUploadImgOpen, filename }) => {
  return (
    <div
      className={`${
        isMobile ? "flex sm:hidden w-full" : "hidden sm:flex w-1/4"
      }  items-center justify-center`}
    >
      <div className="flex-col gap-4">
        <div
          className={
            "relative flex items-center justify-center justify-items-center py-6"
          }
        >
          <div
            className={`flex h-[150px] w-[150px] sm:h-[260px] sm:w-[260px] items-center justify-center overflow-hidden rounded-full border-4 border-white`}
          >
            {!image ? (
              <>
                {DefaultIcon}
                <div
                  onClick={() => {
                    setUploadImgOpen(true);
                  }}
                  className="flex items-center justify-center border-2 border-aquamarine absolute bottom-3 sm:bottom-0 right-6 sm:right-12 bg-electric-violet rounded-full h-8 w-8 sm:h-12 sm:w-12"
                >
                  <NewImage
                    className={
                      "h-4 w-4 sm:h-6 sm:w-6 cursor-pointer hover:scale-105"
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <img
                  src={image}
                  alt="Profile"
                  className="h-[150px] w-[150px] sm:h-[260px] sm:w-[260px] rounded-xl"
                />
                <div
                  onClick={() => {
                    setUploadImgOpen(true);
                  }}
                  className="flex items-center justify-center border-2 border-aquamarine absolute bottom-3 sm:bottom-0 right-6 sm:right-12 bg-electric-violet rounded-full h-8 w-8 sm:h-12 sm:w-12"
                >
                  <EditPenIcon
                    className={
                      "h-4 w-4 sm:h-6 sm:w-6 cursor-pointer hover:scale-105"
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {filename && <div>{filename}</div>}
      </div>

    </div>
  );
};

export { AvatarWithDefault };
