import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Infographic } from "components/Pages/Blog/Infographic";


const SinglePost = ( {blog} ) => {
    return (
        <div>
<section className="text-gray-600 body-font">
  <div className="container px-5 py-12 mx-auto flex flex-col">
    <div className="lg:w-4/6 mx-auto">
      <div className="rounded-lg overflow-hidden">
      <h2 className="text-4xl font-semibold text-gray-800 my-2">{blog.title}</h2>

      </div>
      <div className="flex flex-col sm:flex-row mt-10">
        <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
          <div className="w-20 h-20 rounded-full inline-flex items-center justify-center">
          <img src={`https://cephadex.s3.eu-north-1.amazonaws.com/profile_pictures/${blog.avatar}`} alt="avatar" />
          </div>

        
          <div className="flex flex-col items-center text-center justify-center">
            <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
              {blog.author_name}
            </h2>
            <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4" />
            <p className="text-base">
            {blog.summary}
            </p>
            <div className="flex flex-col items-center">
            {blog.images && blog.images.map((image, index) => (
                <div key={index}>
                    <Infographic thumbnail={image.thumbnail_url} fullVersion={image.image_url} />
                </div>
            ))}


        </div>
          </div>
        </div>
        <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
        <div 
        className="leading-relaxed text-lg mb-4" 
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

        </div>
      </div>
    </div>
  </div>
</section>




           
               


        </div>
    )
}


export { SinglePost }