import { type Blog } from "@customTypes/Globals";
import React from "react";
import { Link } from "react-router-dom";

interface BlogPostProps {
  blog: Blog;
}
export const BlogPost: React.FC<BlogPostProps> = ({ blog }) => {
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  return (
    <div className="flex flex-wrap py-8 md:flex-nowrap">
      <div className="mb-6 flex shrink-0 flex-col md:mb-0 md:w-64">
        <span className="title-font font-semibold text-gray-700">
          {blog.category}
        </span>
        <span className="mt-1 text-sm text-gray-500">{blog.time_created}</span>
      </div>
      <div className="md:grow">
        <Link to={`/blog/${blog.slug}`} onClick={scrollToTop}>
          <h2 className="title-font mb-2 text-2xl font-medium text-gray-900">
            {blog.title}
          </h2>
        </Link>

        <p className="leading-relaxed">{blog.summary}</p>
        <Link
          to={`/blog/${blog.slug}`}
          onClick={scrollToTop}
          className="mt-4 inline-flex items-center text-indigo-500"
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
        </Link>
      </div>
    </div>
  );
};
