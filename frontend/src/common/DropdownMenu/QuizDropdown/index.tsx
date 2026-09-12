import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import DownloadIcon from "@assets/cardMenuIcons/DownloadIcon.svg?react";
import ShareIcon from "@assets/cardMenuIcons/ShareIcon.svg?react";
import EditPenIcon from "@assets/EditPenIcon.svg?react";
import PrintIcon from "@assets/PrintIcon.svg?react";
import PrintQuestionIcon from "@assets/PrintQuestionIcon.svg?react";
import { DropdownMenu } from "@common/DropdownMenu";
import { Doc } from "@quiz/PrintQuiz";
import { pdf } from "@react-pdf/renderer";
import { type QuizSchema } from "@source/client";
import { DeleteConfirmationModal } from "@source/common/Modals/DeleteConfirmationModal";
import { useFetchQuizAndQuestions } from "@source/pages/Quiz/useFetchQuizAndQuestions";
import { AssignQuizModal } from "@source/pages/Quizzes/components/AssignQuizModal";
import { useAppDispatch } from "@store/hooks";
import { deleteOneQuiz } from "@store/quizzes/actions";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { EllipsisMenuButton } from "../components/EllipsisMenuButton";

interface QuizDropdownProps {
  quiz: QuizSchema;
}
const QuizDropdown: React.FC<QuizDropdownProps> = ({ quiz }) => {
  // Here we finish constructing the links adding in the groupId, deckId and boolean.

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [questions, setQuestions] = useState<QuestionSchema[] | null>(null);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const { quizAndQuestions } = useFetchQuizAndQuestions(String(quiz.id) ?? "");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const handleDownload = async (): Promise<void> => {
    if (quizAndQuestions?.questions == null) return;
    const blob = await pdf(
      <Doc questions={quizAndQuestions.questions} quiz={quiz} />
    ).toBlob();
    saveAs(blob, `${quiz.name}.pdf`);
  };
  const handleDelete = async (): Promise<void> => {
    setDeleteModalIsOpen(true);
  };

  const reallyDelete = async (): Promise<void> => {
    await dispatch(deleteOneQuiz(quiz.id));
    setDeleteModalIsOpen(false);
  };
  const links = [
    {
      label: "Edit",
      icon: EditPenIcon,
      type: "",
      onClick: () => {
        navigate(`/quiz/edit/${quiz.id}`);
      },
    },
    {
      label: "Assign",
      icon: ShareIcon,
      type: "",
      onClick: () => {
        setOpenAssignModal(!openAssignModal);
      },
    },
    {
      label: "Download",
      icon: DownloadIcon,
      type: "",
      onClick: handleDownload,
    },
    // {
    //   label: "Results",
    //   icon: EyeIcon,
    //   type: "",
    //   onClick: () => {},
    // },
    {
      label: "Print",
      icon: PrintIcon,
      type: "",
      onClick: () => {},
    },
    {
      label: "Print answers",
      icon: PrintQuestionIcon,
      type: "",
      onClick: () => {},
    },
    {
      label: "Delete",
      icon: DeleteIcon,
      type: "",
      onClick: handleDelete,
    },
  ];

  return (
    <>
      {" "}
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DropdownMenu
          type="Quiz"
          button={<EllipsisMenuButton />}
          links={links}
        />
      </div>
      <AssignQuizModal
        isOpen={openAssignModal}
        setIsOpen={setOpenAssignModal}
        quizId={quiz?.id ?? 0}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalIsOpen}
        setIsOpen={setDeleteModalIsOpen}
        message={"Are you sure you want to delete this quiz?"}
        handleDelete={reallyDelete}
        title=""
      />
    </>
  );
};

export { QuizDropdown };
