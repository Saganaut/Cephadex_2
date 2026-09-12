import UserAvatar from "@assets/UserAvatar.svg";
import { Infographic } from "@blog/Infographic";
import React from "react";

interface ImageType {
  id: number;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  blogId: number;
  type: string;
}
interface SinglePostProps {
  blog: any;
  images: ImageType[];
}
const SinglePost: React.FC<SinglePostProps> = ({ blog, images }) => {
  return (
    <div>
      <section className=" text-gray-600">
        <div className="container mx-auto flex flex-col px-5 py-12">
          <div className="mx-auto lg:w-5/6">
            <div className="overflow-hidden rounded-lg">
              <h2 className=" my-2 text-4xl font-semibold text-gray-800 ">
                {blog.title}
              </h2>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row">
              <div className="text-center sm:w-1/5 sm:py-8 sm:pr-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full">
                  <img src={UserAvatar} alt="avatar" />
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <h2 className="mt-4 text-lg font-medium text-gray-900 ">
                    {blog.author_name}
                  </h2>
                  <div className="mb-4 mt-2 h-1 w-12 rounded bg-indigo-500" />
                  <p className="text-base ">{blog.summary}</p>
                  <div className="flex flex-col items-center">
                    {images.map((image, index) => (
                      <div key={index}>
                        {image.type === "image" && (
                          <Infographic image={image} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border-t border-gray-200  bg-white p-2 pt-4 text-left sm:mt-0 sm:w-4/5 sm:border-l sm:border-t-0 sm:py-8 sm:pl-8">
                <div
                  className="mb-4 text-lg leading-relaxed "
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
