import React from "react";

interface InfographicProps {
  thumbnail: string;
  fullVersion: string;
}
const Infographic: React.FC<InfographicProps> = ({
  thumbnail,
  fullVersion,
}) => {
  const downloadInfographic = (): void => {
    window.open(fullVersion, "_blank");
  };

  return (
    <div className="infographic-item hover:scale-101 my-4 overflow-hidden rounded-lg p-4 shadow-lg transition-transform duration-500">
      <img
        src={thumbnail}
        alt="Infographic Thumbnail"
        className="h-auto w-full cursor-pointer hover:scale-110"
        onClick={downloadInfographic}
      />
    </div>
  );
};

export { Infographic };
