import React from "react";
import { Card } from "@app/Shared/Card";
import { CardAvatar } from "@app/Shared/CardAvatar";
import { useUser } from "@contexts/UserContext";

const CardProfile = () => {
  const { user } = useUser();
  const { userSettings } = useUser();
  console.log("user settings", userSettings);
  return (
    <>
      <Card>
        <div className="bg-blaze-orange rounded-3xl h-full w-full p-4">
          <div className="relative flex flex-col justify-center items-center -top-3 -mb-12 -translate-y-1/2">
            <CardAvatar />
          </div>
          <div className="flex flex-col items-center mb-2">
            <h1 className="text-2xl font-semibold">Hello! </h1>
            <h2 className="text-xl font-medium">
              <span>{user.first_name}</span>
              <span> </span>
              <span>{user.last_name}</span>
            </h2>
            <p className="text-sm">{user.username}</p>
          </div>

          <div className="flex justify-center items-center mt-6 mb-4 text-xl text-black font-semibold">
            {user.remaining_credit} credits
          </div>

          <div className="flex justify-center">
            <div className="mx-1">
              <h3 className="text-sm ">Decks ({user.quantity_decks})</h3>
            </div>
            <div className="mx-1">
              <h3 className="text-sm ">Quizzes ({user.quantity_tests})</h3>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export { CardProfile };
