import { CardAvatar } from "@source/common/Cards/CardProfile/CardAvatar";
import { ErrorMessage } from "@source/common/InfoComponents/ErrorMessage";
import { useAppSelector } from "@store/hooks";
import React, { type ReactElement } from "react";

import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";

const CardProfile = (): ReactElement => {
  const user = useAppSelector((state) => state.user.user);

  if (user === null) {
    return <ErrorMessage message={"Unable to load user data"} />;
  }
  return (
    <div className="h-full w-full rounded-3xl bg-blaze-orange p-[22px]  text-white">
      <div className="relative -top-3 -mb-12 flex -translate-y-1/2 flex-col items-center justify-center">
        <CardAvatar pic={user.pic} />
      </div>
      <div className="mb-2 flex flex-col items-center">
        <Header username={user.username ?? "Unknown"} />
      </div>

      <div className="mb-4 mt-6 flex items-center justify-center text-xl font-semibold text-black">
        <Body
          remainingCredit={
            user.subscriptionPlan != null && user.subscriptionPlan > 5
              ? "unlimited"
              : user?.remainingCredit != null
              ? user.remainingCredit.toFixed(0)
              : 0
          }
        />
      </div>

      <div className="flex justify-center">
        <Footer user={user} />
      </div>
    </div>
  );
};

export { CardProfile };
