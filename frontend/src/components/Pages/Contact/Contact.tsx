import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { FeedbackForm } from "@pages/Contact/FeedbackForm";
import { AddressInfo } from "@pages/Contact/AddressInfo";

const Contact = () => {
  return (
    <>
      <section className="text-gray-600 body-font relative">
        <div className="container mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden flex items-end justify-start relative">
            <AddressInfo />
          </div>
          <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <FeedbackForm />
          </div>
        </div>
      </section>
    </>
  );
};

export { Contact };
