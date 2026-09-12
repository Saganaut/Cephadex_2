import type { LlmRecordsSchema } from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { useAppDispatch } from "@source/lib/store/hooks";
import {
  downvotePromptData,
  upvotePromptData,
} from "@source/lib/store/promptData/actions";
import { truncate } from "@source/lib/utils/functions";
import React from "react";

import { DataEvalModal } from "./dataEvalModal";

interface PromptDataItemProps {
  prompt: LlmRecordsSchema;
}

const PromptDataItem: React.FC<PromptDataItemProps> = ({ prompt }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const handleUpvote = (id: number): void => {
    void dispatch(upvotePromptData(id));
  };

  const handleDownvote = (id: number): void => {
    void dispatch(downvotePromptData(id));
  };

  return (
    <div className="mt-1 rounded-xl bg-mariana-blue p-1">
      <div className="rounded-xl bg-white p-1">
        <h4> ID : {prompt.id} </h4>
        <h4 className="">
          Type:{prompt.type} - Subtype: {prompt.subtype}{" "}
        </h4>
      </div>
      <div className="my-1 rounded-xl  bg-white p-1">
        <p>
          <span className="font-bold">Prompt: </span>
          {truncate(prompt.prompt, 200)}
        </p>
      </div>
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className="my-1 rounded-xl bg-white p-1"
      >
        <h5 className="font-bold">Response:</h5>
        <p>{truncate(prompt.response, 1000)}</p>
      </div>
      <Button
        onClick={() => {
          handleUpvote(prompt.id);
        }}
        label="Upvote"
      />
      <Button
        onClick={() => {
          handleDownvote(prompt.id);
        }}
        label="Downvote"
      />
      <DataEvalModal prompt={prompt} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export { PromptDataItem };
