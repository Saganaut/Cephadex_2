import { Crickets } from "@source/common/InfoComponents/Crickets";
import { Loading } from "@source/common/InfoComponents/Loading";
import { PageHeader } from "@source/common/PageHeader";
import { PageWrapper } from "@source/common/PageWrapper";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { fetchPromptData } from "@source/lib/store/promptData/actions";
import { promptDataSelectors } from "@source/lib/store/promptData/promptDataSlice";
import React, { useEffect } from "react";

import { PromptDataItem } from "./promptDataItem";

const DataEval: React.FC = () => {
  const dispatch = useAppDispatch();
  const promptData = useAppSelector(promptDataSelectors.selectAll);
  const promptStatus = useAppSelector((state) => state.promptData.status);
  useEffect(() => {
    void dispatch(fetchPromptData());
  }, [dispatch]);

  if (promptStatus === "loading") {
    return <Loading />;
  }

  if (promptData.length === 0) {
    return <Crickets />;
  }

  return (
    <>
      <PageWrapper>
        <PageHeader
          title={"Data Evaluator"}
          subtitle={"Rate prompt results"}
          type="withoutImage"
        />
        <div className="">
          {promptData.map((prompt) => (
            <div key={prompt.id}>
              <PromptDataItem prompt={prompt} />
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
};

export default DataEval;
