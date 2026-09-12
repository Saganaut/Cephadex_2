import React from "react";

import { PageButton } from "./PageButton";

const { floor, min, max } = Math;
const range = (lo: number, hi: number) =>
  Array.from({ length: hi - lo }, (_, i) => i + lo);

const pagination =
  (count: number = 4, ellipsis = "…") =>
  (page: number, total: number) => {
    const start = max(1, min(page - floor((count - 3) / 2), total - count + 2));
    const end = Math.min(
      total,
      Math.max(page + floor((count - 4 + 2 * (count % 2)) / 2), count - 1)
    );
    const paginatedList = [
      ...(start > 2 ? [1, ellipsis] : start > 1 ? [1] : []),
      ...range(start, end + 1),
      ...(end < total - 1 ? [ellipsis, total] : end < total ? [total] : []),
    ];
    return paginatedList;
  };

interface PaginatorProps {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  qtyPages: number;
  pageNumbersToShow?: number; // only use even numbers defaults to 4
}

const Paginator: React.FC<PaginatorProps> = ({
  pageNumber,
  setPageNumber,
  qtyPages,
  pageNumbersToShow = 4,
}) => {
  const handleLeftClick = (): void => {
    if (pageNumber === 1) return;
    setPageNumber(pageNumber - 1);
  };
  const handleRightClick = (): void => {
    if (pageNumber === qtyPages) return;
    setPageNumber(pageNumber + 1);
  };

  const myPaginator = pagination(pageNumbersToShow);

  const pages = myPaginator(pageNumber, qtyPages);
  return (
    <>
      <div className="flex">
        <div className="mx-1 ">
          <button
            className="h-10 w-10 rounded-lg bg-electric-violet-200 text-tolopea dark:bg-mariana-blue dark:text-aquamarine"
            onClick={() => {
              handleLeftClick();
            }}
          >
            &lt;
          </button>
        </div>
        {pages.map((page, index) => {
          return page === "…" ? (
            <div key={index} className="mx-1">
              <button className="h-10 w-10 bg-mariana-blue/30 text-aquamarine">
                ...
              </button>
            </div>
          ) : (
            <div className="mx-1  rounded-lg" key={index}>
              <PageButton
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageIndex={Number(page)}
              />
            </div>
          );
        })}
        <div className="mx-1 ">
          <button
            className="h-10 w-10 rounded-lg bg-electric-violet-200 text-tolopea dark:bg-mariana-blue dark:text-aquamarine"
            onClick={() => {
              handleRightClick();
            }}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};
export { Paginator };
