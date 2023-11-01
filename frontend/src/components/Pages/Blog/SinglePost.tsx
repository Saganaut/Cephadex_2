import { Infographic } from "@pages/Blog/Infographic";
import { type Blog } from "@source/types/Globals";
import React from "react";

interface SinglePostProps {
  blog: Blog;
}
const SinglePost: React.FC<SinglePostProps> = ({ blog }) => {
  return (
    <div>
      <section className="body-font text-gray-600">
        <div className="container mx-auto flex flex-col px-5 py-12">
          <div className="mx-auto lg:w-4/6">
            <div className="overflow-hidden rounded-lg">
              <h2 className="my-2 text-4xl font-semibold text-gray-800">
                {blog.title}
              </h2>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row">
              <div className="text-center sm:w-1/3 sm:py-8 sm:pr-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full">
                  <img
                    src={`https://cephadex.s3.eu-north-1.amazonaws.com/profile_pictures/${blog.avatar}`}
                    alt="avatar"
                  />
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <h2 className="title-font mt-4 text-lg font-medium text-gray-900">
                    {blog.author_name}
                  </h2>
                  <div className="mb-4 mt-2 h-1 w-12 rounded bg-indigo-500" />
                  <p className="text-base">{blog.summary}</p>
                  <div className="flex flex-col items-center">
                    {blog.images?.map((image, index) => (
                      <div key={index}>
                        <Infographic
                          thumbnail={image.thumbnail_url}
                          fullVersion={image.image_url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4 text-center sm:mt-0 sm:w-2/3 sm:border-l sm:border-t-0 sm:py-8 sm:pl-8 sm:text-left">
                <div
                  className="mb-4 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { SinglePost };
