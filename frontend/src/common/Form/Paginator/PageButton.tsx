import React from "react";

interface PageButtonProps {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pageIndex: number; // this is the index of the page in the array of pages
}
const PageButton: React.FC<PageButtonProps> = ({
  pageIndex,
  pageNumber,
  setPageNumber,
}) => {
  return (
    <>
      <button
        className={`${
          pageNumber === pageIndex
            ? "bg-electric-violet text-white dark:bg-blaze-orange"
            : "bg-electric-violet-200 dark:bg-mariana-blue"
        } h-10 w-10  rounded-lg text-tolopea dark:text-aquamarine`}
        onClick={() => {
          setPageNumber(pageIndex);
        }}
      >
        {pageIndex}
      </button>{" "}
    </>
  );
};

export { PageButton };
