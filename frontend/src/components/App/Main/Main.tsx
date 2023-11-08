import { DashboardCardContainer } from "@source/components/App/Main/DashboardCardContainer";
// import { useUser } from "@contexts/UserContext";
import React, { type ReactElement } from "react";

const Main = (): ReactElement => {
  // const { user } = useUser();

  // console.log(user["user-id"]);

  return (
    <div>
      <section className="body-font text-gray-600">
        <div className="container mx-auto px-5">
          <div className="mb-5 flex w-full flex-wrap">
            <div className="mb-6 w-full lg:mb-0 lg:w-1/2">
              <h1 className="sm:font-sm text-black dark:text-white sm:text-2xl">
                My Tentacles
              </h1>
            </div>
          </div>
          <DashboardCardContainer />
        </div>
      </section>
    </div>
  );
};

export { Main };
