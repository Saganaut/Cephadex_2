import { formatDate } from "@source/lib/utils/functions";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface BlogPostProps {
  blog: any;
}
export const BlogPost: React.FC<BlogPostProps> = ({ blog }) => {
  const { pathname } = useLocation();

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate(`/blog/${blog.slug}`);
  };

  useEffect(() => {
    scrollToTop();
  }, [pathname]);
  return (
    <div className="flex flex-wrap py-8 md:flex-nowrap ">
      <div className="mb-6 flex shrink-0 flex-col md:mb-0 md:w-64">
        <span className=" font-semibold text-gray-700 ">{blog.category}</span>
        <span className="mt-1 text-sm text-gray-500 ">
          {formatDate(blog.timeCreated)}
        </span>
      </div>
      <div className="md:grow">
        <h2
          onClick={handleClick}
          className=" mb-2 cursor-pointer text-2xl font-medium text-gray-900 "
        >
          {blog.title}
        </h2>

        <p className="leading-relaxed">{blog.summary}</p>
        <div
          onClick={handleClick}
          className="mt-4 inline-flex cursor-pointer items-center text-indigo-500"
        >
          Learn More
          <svg
            className="ml-2 h-4 w-4"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
