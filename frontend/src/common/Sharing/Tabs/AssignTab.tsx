import { Button } from "@source/common/Buttons/Button";
import { TagsInput } from "@common/Form/TagsInput";
import { DeckService, QuizService } from "@source/client";
import { useToast } from "@source/lib/contexts/ToastContext";
import React, { useState } from "react";

interface AssignTabProps {
  itemId: number;
  type: "quiz" | "deck";
}
const AssignTab: React.FC<AssignTabProps> = ({ itemId, type }) => {
  const { postToast } = useToast();

  const [tags, setTags] = useState<string[]>([]);
  const handleAssignQuiz = async (): Promise<void> => {
    const response = await QuizService.assignQuiz(itemId, {
      emails: tags,
    });
    if (response.status === "success") {
      postToast({
        message: "Quiz shared successfully",
        title: "Success!",
      });
      setTags([]);
    } else {
      postToast({
        message: "Failed to share quiz",
        title: "Error!",
      });
    }
  };

  const handleShareDeck = async (): Promise<void> => {
    const response = await DeckService.shareDeck(itemId, {
      emails: tags,
    });
    if (response.status === "success") {
      postToast({
        message: "Deck shared successfully",
        title: "Success!",
      });
      setTags([]);
    } else {
      postToast({
        message: "Failed to share deck",
        title: "Error!",
      });
    }
  };

  const handleClick = (): void => {
    void (type === "quiz" ? handleAssignQuiz() : handleShareDeck());
  };
  return (
    <div className={"flex flex-col items-center justify-center"}>
      <TagsInput tags={tags} setTags={setTags} />
      <div className={"mx-auto mt-[24px] flex justify-between"}>
        <Button
          disabled={tags.length === 0}
          label={"Share"}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};
export { AssignTab };
