import { PageWrapper } from "@common/PageWrapper";
import React, { type ReactElement } from "react";

import { BlogContainer } from "./BlogContainer";

export default function Blog(): ReactElement {
  return (
    <PageWrapper>
      <BlogContainer />
    </PageWrapper>
  );
}
