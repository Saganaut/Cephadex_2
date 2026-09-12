import { PageWrapper } from "@common/PageWrapper";
import React, { type ReactElement } from "react";

import { TermsAndConditions } from "./components/TermsAndConditions";

export default function TermsPage(): ReactElement {
  return (
    <PageWrapper>
      {" "}
      <TermsAndConditions />
    </PageWrapper>
  );
}
