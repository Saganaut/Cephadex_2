import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import React from "react";

interface FAQCardProps {
  question: string;
  answer: string;
}
const FAQCard: React.FC<FAQCardProps> = ({ question, answer }) => {
  return (
    <>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full  items-center justify-between rounded-lg px-4  py-2 text-left text-xl text-white   focus:outline-none  focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-[75%] bg-mariana-blue hover:bg-mariana-blue-100">
              <div className="flex items-center gap-2">
                {" "}
                <span>{question}</span>
              </div>
              <ChevronUpIcon
                className={`${open ? "rotate-180" : ""} h-10 w-10 text-white `}
              />
            </Disclosure.Button>
            <Transition
              enter="transition duration-300 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-white">
                <p>{answer} </p>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </>
  );
};

export { FAQCard };
