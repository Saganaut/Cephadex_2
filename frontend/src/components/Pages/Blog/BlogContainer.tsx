import { BlogPost } from "@pages/Blog/BlogPost";
import { SinglePost } from "@pages/Blog/SinglePost";
import { fetchAllBlogs, fetchSingleBlog } from "@services/Api/Info/BlogApi";
import { type Blog } from "@source/types/Globals";
import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";

const BlogContainer = (): ReactElement => {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data = await fetchAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    void fetchData();
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
    if (slug != null) {
      void fetchAndSetSingleBlog();
    }
  }, [slug, fetchAndSetSingleBlog]);

  return (
    <>
      {slug == null && (
        <h1 className="flex justify-center p-3 text-5xl font-bold text-electric-violet ">
          InkSights By Cephadex
        </h1>
      )}
      <section className="body-font overflow-hidden text-gray-600">
        {slug != null && blog != null && (
          // Render individual blog post
          <SinglePost blog={blog} />
        )}

        <div className="container mx-auto px-5 py-20">
          {blogs == null ? (
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
