import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';


const PricingCardListItems = ({ feature }) => {
    return (
        <div>
            <p className="flex items-center text-gray-600 mb-6">
        <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-blaze-orange text-white rounded-full flex-shrink-0">
            <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                className="w-3 h-3"
                viewBox="0 0 24 24"
            >
                <path d="M20 6L9 17l-5-5" />
            </svg>
        </span>
       {feature}
    </p>
        </div>
    )
}

export { PricingCardListItems }