import UserAvatar from "@assets/UserAvatar.svg";
import { useAppSelector } from "@store/hooks";
import React from "react";

interface BotMessageProps {
  message: string;
}
const UserMessage: React.FC<BotMessageProps> = ({ message }) => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className={"mb-[14px]"}>
      <div className={"flex flex-row-reverse items-start gap-x-[10px]"}>
        <img alt={""} src={UserAvatar} className={"w-[36px]"} />
        <div>
          <p
            className={
              "pb-[4px] text-right text-[10px] font-medium text-electric-violet-200"
            }
          >
            {user?.username}
          </p>
          <p
            className={
              "rounded-[20px_0px_20px_20px] bg-mariana-blue-100 px-[12px] py-[8px] text-left text-sm text-white dark:bg-mariana-blue"
            }
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
export { UserMessage };
