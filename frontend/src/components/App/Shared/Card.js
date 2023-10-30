import React from 'react';

const Card = ({children}) => {
    return (
        <div className="bg-mariana-blue  h-96 w-96 rounded-3xl text-white">
           {children}
        </div>
    );
};
export {Card}