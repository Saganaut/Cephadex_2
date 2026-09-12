import { BlogPost } from "@blog/BlogPost";
import { SinglePost } from "@blog/SinglePost";
import { type BlogSchemaFull, InfoService } from "@source/client";
import { Loading } from "@source/common/InfoComponents/Loading";
import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation, useParams } from "react-router-dom";

interface ImageType {
  id: number;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  blogId: number;
  type: string;
}
const BlogContainer = (): ReactElement => {
  const { pathname } = useLocation();

  const [blogs, setBlogs] = useState<BlogSchemaFull[] | null>(null);
  const [blog, setBlog] = useState<BlogSchemaFull | null>(null);
  const [images, setImages] = useState<ImageType[] | null>(null);
  const { slug = "" } = useParams();
  // const scrollToTop = (): void => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };
  const scrollToTop = (): void => {
    const topElement = document.getElementById("top-of-page");
    if (topElement != null) {
      topElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const data = await InfoService.getAllBlogPosts();
        setBlogs(data.blogs);
      } catch (error) {}
    };

    void fetchData();
  }, []);

  const fetchAndSetSingleBlog = useCallback(async () => {
    try {
      if (slug === "") {
        return;
      }
      const data = await InfoService.getBlogPost(slug);
      setBlog(data.blog[0]);
      setImages(data.images);
    } catch (error) {}
  }, [slug]);

  useEffect(() => {
    if (slug != null) {
      void fetchAndSetSingleBlog();
    }
  }, [slug, fetchAndSetSingleBlog]);

  return (
    <div className="relative rounded-xl bg-white py-4">
      <div className="absolute top-[-300px]" id="top-of-page"></div>{" "}
      {/* This is a hack to scroll to top */}
      <div className="">
        {slug === "" && (
          <h1 className="flex justify-center p-3 text-5xl font-bold text-electric-violet ">
            Our Inksights
          </h1>
        )}
      </div>
      <section className=" mx-auto max-w-[1200px] overflow-hidden text-gray-900 ">
        {slug != null && blog != null && (
          // Render individual blog post
          <SinglePost blog={blog} images={images} />
        )}

        <div className="container mx-auto px-5 py-20">
          {blogs == null ? (
            <>
              <Loading />{" "}
            </>
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
    </div>
  );
};
export { BlogContainer };
