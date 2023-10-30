import React from "react";

const StdButton = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` 
        px-4 py-1 mr-5 mb-4 rounded-full text-white bg-electric-violet border-2 
       text-lg cursor-pointer transform transition-transform 
        hover:bg-blaze-orange hover:border-secondary-400 hover:scale-101 hover:shadow-md 
        active:bg-primary-400 
        ${
          disabled
            ? "bg-grey-300 text-opacity-10 cursor-not-allowed shadow-none"
            : ""
        }
      `}
    >
      {label}
    </button>
  );
};

const SignUpButton = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` 
        px-4 py-1 mr-5 mb-4 rounded-full text-white bg-blaze-orange
       text-lg cursor-pointer transform transition-transform 
        hover:bg-blaze-orange-300 hover:scale-101 hover:shadow-md 
        active:bg-primary-400 
        ${
          disabled
            ? "bg-grey-300 text-opacity-10 cursor-not-allowed shadow-none"
            : ""
        }
      `}
    >
      {label}
    </button>
  );
};

const HowItWorksButton = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` 
        px-4 py-1 mr-5 mb-4 rounded-full text-white bg-electric-violet border border-white
       text-lg cursor-pointer transform transition-transform 
        hover:bg-blaze-orange-300 hover:scale-101 hover:shadow-md 
        active:bg-primary-400 
        ${
          disabled
            ? "bg-grey-300 text-opacity-10 cursor-not-allowed shadow-none"
            : ""
        }
      `}
    >
      {label}
    </button>
  );
};

export { StdButton };
export { SignUpButton };

export { HowItWorksButton };
