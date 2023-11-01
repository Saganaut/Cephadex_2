import { Card } from "@app/Shared/Card";
import { CardAvatar } from "@app/Shared/CardAvatar";
import { useUser } from "@contexts/UserContext";
import React, { type ReactElement } from "react";

const CardProfile = (): ReactElement => {
  const { user } = useUser();
  const { userSettings } = useUser();
  console.log("user settings", userSettings);
  return (
    <>
      <Card>
        <div className="h-full w-full rounded-3xl bg-blaze-orange p-4">
          <div className="relative -top-3 -mb-12 flex -translate-y-1/2 flex-col items-center justify-center">
            <CardAvatar />
          </div>
          <div className="mb-2 flex flex-col items-center">
            <h1 className="text-2xl font-semibold">Hello! </h1>
            <h2 className="text-xl font-medium">
              <span>{user?.first_name}</span>
              <span> </span>
              <span>{user?.last_name}</span>
            </h2>
            <p className="text-sm">{user?.username}</p>
          </div>

          <div className="mb-4 mt-6 flex items-center justify-center text-xl font-semibold text-black">
            {user?.remaining_credit} credits
          </div>

          <div className="flex justify-center">
            <div className="mx-1">
              <h3 className="text-sm ">Decks ({user?.quantity_decks})</h3>
            </div>
            <div className="mx-1">
              <h3 className="text-sm ">Quizzes ({user?.quantity_tests})</h3>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export { CardProfile };
