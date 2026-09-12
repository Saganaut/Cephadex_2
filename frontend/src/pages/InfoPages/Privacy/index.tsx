import { PageWrapper } from "@common/PageWrapper";
import React, { type ReactElement } from "react";

import { PrivacyPolicy } from "./PrivacyPolicy";

export default function Privacy(): ReactElement {
  return (
    <PageWrapper>
      {" "}
      <PrivacyPolicy />
    </PageWrapper>
  );
}
