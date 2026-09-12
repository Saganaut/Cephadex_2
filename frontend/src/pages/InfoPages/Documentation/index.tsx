import { PageWrapper } from "@common/PageWrapper";
import { SpeakingCeph } from "@source/common/SpeakingCeph";
import { CollapsableCard } from "@source/pages/InfoPages/Documentation/CollapsableCard";
import React, { type ReactElement } from "react";

import { Guide } from "./documentation";

export default function Documentation(): ReactElement {
  // const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <PageWrapper className="bg-tolopea">
      <div className="mt-[-100px] bg-tolopea">
        {" "}
        <SpeakingCeph
          type={"teacher"}
          text="Learn about all our features in our documentation."
        />{" "}
      </div>
      {/* <div> */}
      {/* <h1 className="flex justify-center pb-[24px]  text-5xl font-bold text-electric-violet ">
          Documentation
        </h1> */}
      {/* </div> */}
      <div className="mx-auto  bg-tolopea  px-2 sm:rounded-xl md:max-w-[90vw] md:px-4 lg:max-w-[1000px]">
        {Guide.map((guide, index) => (
          <div key={index} className="py-2">
            <div className={"rounded-xl bg-mariana-blue-100  p-2 "}>
              <CollapsableCard key={index} guideSection={guide} />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
