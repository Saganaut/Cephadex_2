import React from "react";

interface TutorialSectionProps {
  video: string;
  title: string;
  description: string;
}
const TutorialSection: React.FC<TutorialSectionProps> = ({
  video,
  title,
  description,
}) => {
  return (
    <div>
      {" "}
      <h1 className="text-center text-2xl font-semibold text-white dark:text-white pb-2">
        {title}
      </h1>
      <div
        className="relative w-full overflow-hidden"
        style={{ paddingBottom: "56.25%" }}
      >
        <iframe
          src={video}
          allowFullScreen
          frameBorder="0"
          style={{ position: "absolute", inset: 0 }}
          className="h-full w-full border-0"
        ></iframe>
      </div>
    </div>
  );
};

export { TutorialSection };
