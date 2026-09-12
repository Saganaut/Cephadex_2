import type { QuizSchema, QuizSharingFullSchema } from "@source/client";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { fetchQuizzes } from "@source/lib/store/quizzes/actions";
import { selectAllQuizzes } from "@source/lib/store/quizzes/quizzesSlice";
import { type QuizAndQuestionsSchema } from "@source/lib/store/quizzes/quizzesSlice";
import { fetchSharedQuizzes } from "@source/lib/store/sharedQuizzes/actions";
import { selectAllSharedQuizzes } from "@source/lib/store/sharedQuizzes/sharedQuizzesSlice";
import { useEffect, useMemo } from "react";

const useFetchQuizzes = (): {
  quizzes: QuizAndQuestionsSchema[];
  quizzesStatus: "idle" | "loading" | "succeeded" | "failed";
  justQuizzes: QuizSchema[];
} => {
  const quizzesStatus = useAppSelector((state) => state.quizzes.status);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (quizzesStatus === "succeeded") {
      return;
    }
    if (quizzesStatus === "idle") {
      void dispatch(fetchQuizzes());
    }
  }, [quizzesStatus, dispatch]);

  const quizzes = useAppSelector(selectAllQuizzes);

  const justQuizzes = useMemo(
    () =>
      quizzes.map((quiz) => ({
        ...quiz.quiz,
        type: "Quiz",
      })),
    [quizzes]
  );
  return { quizzes, quizzesStatus, justQuizzes };
};

const useFetchSharedQuizzes = (): {
  sharedQuizzes: QuizSharingFullSchema[];
  sharedQuizzesStatus: "idle" | "loading" | "succeeded" | "failed";
} => {
  const sharedQuizzesStatus = useAppSelector(
    (state) => state.sharedQuizzes.status
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (sharedQuizzesStatus === "succeeded") {
      return;
    }
    if (sharedQuizzesStatus === "idle") {
      void dispatch(fetchSharedQuizzes());
    }
  }, [sharedQuizzesStatus, dispatch]);

  const sharedQuizzes = useAppSelector(selectAllSharedQuizzes);
  return { sharedQuizzes, sharedQuizzesStatus };
};

export { useFetchSharedQuizzes };

export { useFetchQuizzes };
