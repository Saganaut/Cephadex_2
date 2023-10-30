import React from 'react';



const TestimonialCard = ({image, name, title, text}) => {
    return (
    <div className="lg:w-1/3 lg:mb-0 p-4">
        <div className="h-full text-center border rounded-xl bg-mariana-blue p-4">
            <img
                alt="testimonial"
                className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"
                src={image} />

        <h2 className="text-white font-medium title-font tracking-wider text-sm">
                    {name}
                </h2>
                <p className="text-gray-500">{title}</p>


                 <span className="inline-block h-1 w-10 rounded bg-electric-violet mt-6 mb-4" />
       
            <p className="leading-relaxed text-white">
       {text}
            </p>

        </div>
        </div>
)
}

export { TestimonialCard }

