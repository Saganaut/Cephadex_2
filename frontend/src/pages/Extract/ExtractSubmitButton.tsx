import React from "react";

interface ExtractSubmitButtonProps {
  isDisabled: boolean;
}

const ExtractSubmitButton: React.FC<ExtractSubmitButtonProps> = ({
  isDisabled,
}) => {
  return (
    <>
      <button
        id="create-submit-button"
        className={` rounded-full px-8 py-2 text-xl text-white ${
          isDisabled ? "cursor-not-allowed opacity-50 " : " bg-blaze-orange "
        }`}
        type="submit"
        disabled={isDisabled}
      >
        Create
      </button>
    </>
  );
};

export { ExtractSubmitButton };
