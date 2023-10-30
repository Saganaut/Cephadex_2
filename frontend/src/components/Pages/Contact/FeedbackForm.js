import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';

const FeedbackForm = () => {

    return (
        <>
    
    <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
    Feedback
  </h2>
  <p className="leading-relaxed mb-5 text-gray-600">
    Post-ironic portland shabby chic echo park, banjo fashion axe
  </p>
  <div className="relative mb-4">
    <label htmlFor="name" className="leading-7 text-sm text-gray-600">
      Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
    />
  </div>
  <div className="relative mb-4">
    <label htmlFor="email" className="leading-7 text-sm text-gray-600">
      Email
    </label>
    <input
      type="email"
      id="email"
      name="email"
      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
    />
  </div>
  <div className="relative mb-4">
    <label htmlFor="message" className="leading-7 text-sm text-gray-600">
      Message
    </label>
    <textarea
      id="message"
      name="message"
      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
      defaultValue={""}
    />
  </div>
  <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
    Button
  </button>
  <p className="text-xs text-gray-500 mt-3">
    Chicharrones blog helvetica normcore iceland tousled brook viral
    artisan.
  </p>
  </>
  )
}

export { FeedbackForm }