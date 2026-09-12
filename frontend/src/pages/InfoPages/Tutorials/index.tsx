import { PageWrapper } from "@common/PageWrapper";
import { SpeakingCeph } from "@source/common/SpeakingCeph";
import React, { type ReactElement } from "react";

import { tutorials } from "./data";
import { TutorialSection } from "./TutorialSection";

export default function Tutorials(): ReactElement {
  return (
    <PageWrapper className="bg-tolopea">
      <div className="mt-[-100px] bg-tolopea">
        <h1 className="text-center text-[42px] text-white pb-5">Tutorials</h1>
        <SpeakingCeph
          type={"teacher"}
          text="Follow along with these tutorials to learn more about Cephadex."
        />{" "}
      </div>

      <div className="mx-auto  bg-tolopea  px-2 sm:rounded-xl md:max-w-[90vw] md:px-4 lg:max-w-[1000px]">
        {tutorials.map((tutorial, index) => (
          <div key={index} className="py-2">
            <div className={"rounded-xl bg-mariana-blue-100  p-2 "}>
              <TutorialSection key={index} {...tutorial} />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
