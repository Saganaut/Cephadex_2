import React from "react";
import { ImGift } from "react-icons/im";

interface ImageType {
  id: number;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  blogId: number;
  type: string;
}
interface InfographicProps {
  image: ImageType;
}
const Infographic: React.FC<InfographicProps> = ({ image }) => {
  const downloadInfographic = (): void => {
    window.open(image.imageUrl, "_blank");
  };

  return (
    <div className=" my-4 overflow-hidden rounded-lg p-4 shadow-lg  transition-transform duration-500 ">
      <img
        src={image.thumbnailUrl}
        alt="Infographic Thumbnail"
        className="h-auto w-full cursor-pointer "
        onClick={downloadInfographic}
      />
      <div className="text-xs">{image.name}</div>
    </div>
  );
};

export { Infographic };
