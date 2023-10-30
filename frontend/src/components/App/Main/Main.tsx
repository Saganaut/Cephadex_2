import React from "react";
import { useUser } from "@contexts/UserContext";
import { CardContainer } from "@app/Shared/CardContainer";

const Main = () => {
  const { user } = useUser();

  console.log(user["user-id"]);

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto ">
          <div className="flex flex-wrap w-full mb-5">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-2xl sm:font-sm text-black dark:text-white">
                My Tentacles
              </h1>
            </div>
          </div>
          <CardContainer />
        </div>
      </section>
    </div>
  );
};

export { Main };
