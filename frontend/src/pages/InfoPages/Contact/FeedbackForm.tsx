import React, { type ReactElement } from "react";

const FeedbackForm = (): ReactElement => {
  return (
    <>
      <h2 className=" mb-1 text-lg font-medium text-gray-900">Feedback</h2>
      <p className="mb-5 leading-relaxed text-gray-600">
        Post-ironic portland shabby chic echo park, banjo fashion axe
      </p>
      <div className="relative mb-4">
        <label htmlFor="name" className="text-sm leading-7 text-gray-600">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="email" className="text-sm leading-7 text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="relative mb-4">
        <label htmlFor="message" className="text-sm leading-7 text-gray-600">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className="h-32 w-full resize-none rounded border border-gray-300 bg-white px-3 py-1 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          defaultValue={""}
        />
      </div>
      <button className="rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none">
        Button
      </button>
      <p className="mt-3 text-xs text-gray-500">
        Chicharrones blog helvetica normcore iceland tousled brook viral
        artisan.
      </p>
    </>
  );
};

export { FeedbackForm };
