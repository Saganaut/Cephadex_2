import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { BlogPost } from "@pages/Blog/BlogPost";
import { SinglePost } from "@pages/Blog/SinglePost";
import { fetchAllBlogs, fetchSingleBlog } from "@services/Api/Info/BlogApi";

const BlogContainer = () => {
  const [blogs, setBlogs] = useState(null);
  const [blog, setBlog] = useState(null);
  const { slug } = useParams();
  console.log("Slug from useParams:", slug);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchAndSetSingleBlog = useCallback(async () => {
    try {
      const data = await fetchSingleBlog(slug);
      setBlog(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchAndSetSingleBlog();
    }
  }, [slug, fetchAndSetSingleBlog]);

  return (
    <>
      {!slug && (
        <h1 className="flex justify-center text-5xl font-bold text-electric-violet p-3 ">
          InkSights By Cephadex
        </h1>
      )}
      <section className="text-gray-600 body-font overflow-hidden">
        {slug && blog && (
          // Render individual blog post
          <SinglePost blog={blog} />
        )}

        <div className="container px-5 py-20 mx-auto">
          {!blogs ? (
            <div>Loading...</div>
          ) : (
            <div className="-my-8 divide-y-2 divide-gray-100">
              {blogs.map((blog, index) => (
                <div key={index}>
                  <BlogPost blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export { BlogContainer };
