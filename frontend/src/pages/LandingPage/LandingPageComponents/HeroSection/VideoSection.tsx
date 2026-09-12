import React from 'react'

const VideoSection: React.FC = () => {
    return (
        <div className="relative overflow-hidden rounded-xl pt-[56.25%]">
            <iframe
                src="https://www.youtube.com/embed/videoseries?si=BO9A4W9fsxDcC7YW&amp;list=PLhj1u_PtIA4cHUjF-5tkmSu1WuX1q8Yo4"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 size-full"
            ></iframe>
        </div>
    )
}

export { VideoSection }
