import React from "react";

const Infographic = ({ thumbnail, fullVersion }) => {
  const downloadInfographic = () => {
    window.open(fullVersion, "_blank");
  };

  return (
    <div className="infographic-item my-4 p-4 rounded-lg overflow-hidden shadow-lg transition-transform duration-500 hover:scale-101">
      <img
        src={thumbnail}
        alt="Infographic Thumbnail"
        className="w-full h-auto cursor-pointer transform hover:scale-110"
        onClick={downloadInfographic}
      />
    </div>
  );
};

export { Infographic };
