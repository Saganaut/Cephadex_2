import { PageWrapper } from "@common/PageWrapper";
import { SpeakingCeph } from "@source/common/SpeakingCeph";
import React, { type ReactElement } from "react";

import { questions } from "./data";
import { FAQCard } from "./FAQCard";

export default function FAQ(): ReactElement {
  return (
    <PageWrapper className="bg-tolopea">
      <div className="mt-[-100px] bg-tolopea">
        {" "}
        <SpeakingCeph
          type={"teacher"}
          text="Have a question, check our FAQ or email me directly - ceph@cephadex.com"
        />{" "}
      </div>

      <div className="mx-auto  bg-tolopea  px-2 sm:rounded-xl md:max-w-[90vw] md:px-4 lg:max-w-[1000px]">
        {questions.map((question, index) => (
          <div key={index} className="py-2">
            <div className={"rounded-xl bg-mariana-blue-100  p-2 "}>
              <FAQCard key={index} {...question} />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
