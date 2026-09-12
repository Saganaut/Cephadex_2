import React from "react";

import { type GuideType, type SectionType } from "./documentation";

interface GuideContentProps {
  guideSection: GuideType;
}

const GuideItem: React.FC<SectionType> = ({
  sectionSummary,
  sectionTitle,
  sectionitems,
}) => {
  return (
    <div className="py-4">
      <div className="py-3">
        <h3 className="text-xl font-bold">{sectionTitle}</h3>
        <p>{sectionSummary}</p>
      </div>
      <ul className="ml-4">
        {sectionitems.map((item, index) => (
          <li className="py-2" key={index}>
            {" "}
            {index + 1} - {item}{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

const GuideContent: React.FC<GuideContentProps> = ({ guideSection }) => {
  return (
    <div className="">
      {guideSection.sections.map((section, index) => (
        <div key={index}>
          <GuideItem {...section} />
        </div>
      ))}
    </div>
  );
};

export { GuideContent };
