import { AddressInfo } from "@pages/Contact/AddressInfo";
import { FeedbackForm } from "@pages/Contact/FeedbackForm";
import React, { type ReactElement } from "react";

const Contact = (): ReactElement => {
  return (
    <>
      <section className="body-font relative text-gray-600">
        <div className="container mx-auto flex flex-wrap sm:flex-nowrap">
          <div className="relative flex items-end justify-start overflow-hidden rounded-lg bg-gray-300 md:w-1/2 lg:w-2/3">
            <AddressInfo />
          </div>
          <div className="mt-8 flex w-full flex-col bg-white md:ml-auto md:mt-0 md:w-1/2 md:py-8 lg:w-1/3">
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
};

export { Contact };
