import React from "react";
import { Link } from "react-router-dom";

function BlogPost({ blog }) {
    const scrollToTop = () => {
        window.scrollTo({
          top: 0, 
          behavior: 'smooth'  // for smooth scrolling
        });
      };


  return (
    <div className="py-8 flex flex-wrap md:flex-nowrap">
      <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
        <span className="font-semibold title-font text-gray-700">
          {blog.category}
        </span>
        <span className="mt-1 text-gray-500 text-sm">{blog.time_created}</span>
      </div>
      <div className="md:flex-grow">
        <Link to={`/blog/${blog.slug}`} onClick={scrollToTop}>
          <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
            {blog.title}
          </h2>
        </Link>

        <p className="leading-relaxed">{blog.summary}</p>
        <Link
          to={`/blog/${blog.slug}`} onClick={scrollToTop}
          className="text-indigo-500 inline-flex items-center mt-4"
        >
          Learn More
          <svg
            className="w-4 h-4 ml-2"
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
}

export { BlogPost };
