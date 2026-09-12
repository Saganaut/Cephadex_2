import { PageHeader } from "@source/common/PageHeader";
import { PageWrapper } from "@source/common/PageWrapper";
import React from "react";

import BannerForm from "./BannerForm";

const ManageBanner: React.FC = () => {
  const handleOnSubmit = (): void => {};

  return (
    <PageWrapper>
      <PageHeader title="Manage Banner" />
      <div className="flex min-h-[80vh] items-center justify-center rounded-xl bg-mariana-blue-100 text-2xl text-black">
        <BannerForm onSubmit={handleOnSubmit} />
      </div>
    </PageWrapper>
  );
};

export default ManageBanner;
