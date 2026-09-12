import { type UserSchema } from "@source/client";
import React from "react";

interface FooterProps {
  user: UserSchema;
}
const Footer: React.FC<FooterProps> = ({ user }) => {
  return (
    <>
      {" "}
      <div className="mx-1">
        <h3 className="text-sm ">Decks: {user?.quantityDecks}</h3>
      </div>
      <div className="mx-1">
        <h3 className="text-sm ">Quizzes: {user?.quantityQuizzes}</h3>
      </div>
    </>
  );
};

export { Footer };
