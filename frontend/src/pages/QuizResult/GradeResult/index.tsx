import { PageWrapper } from "@common/PageWrapper";
import { Header } from "@quiz/components/Results/Header";
import {
  type QuestionResultSchema,
  type QuizResultSchema,
  QuizService,
  type SingleQuizResultResponse,
} from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { useToast } from "@source/lib/contexts/ToastContext";
import { useFetchUser } from "@source/lib/hooks/userHooks/useFetchUser";
import React, { type ReactElement, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { Answer } from "../components/Answer";

const GradeResult = (): ReactElement => {
  const { postToast } = useToast();

  const { resultId } = useParams();
  const [query] = useSearchParams();
  const guestId = query.get("guestId");
  const [collapse, setCollapse] = useState(true);
  const { user } = useFetchUser();
  const [correct, setCorrect] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [quizResults, setQuizResults] =
    useState<SingleQuizResultResponse | null>(null);

  const [gradedQuestions, setGradedQuestions] = useState<
    QuestionResultSchema[]
  >([]);

  const fetchQuizResults = async (): Promise<void> => {
    const results = await QuizService.getQuizResult(
      parseInt(resultId ?? ""),
      guestId != null ? parseInt(guestId) : null
    );
    const questions: QuestionResultSchema[] = results.gradedResults?.map(
      (r) => r.result
    );
    setQuizResults(results);
    setGradedQuestions(questions ?? []);
    setCorrect(results.quizResult?.correct ?? 0);
    setPoints(results.quizResult?.points ?? 0);
  };

  const handleManualResultsUpdate = async (): Promise<void> => {
    const points = gradedQuestions.reduce((accumulator, q) => {
      return accumulator + (q?.points ?? 0);
    }, 0);
    const correct = gradedQuestions.filter((q) => q.correct === true).length;
    setCorrect(correct);
    setPoints(points);
    await QuizService.gradeQuizManually(
      quizResults?.quiz?.id ?? 0,
      parseInt(resultId ?? ""),
      {
        quizResult: {
          ...(quizResults?.quizResult as QuizResultSchema),
          points,
          correct,
        },
        questionResults: gradedQuestions,
      }
    );
    postToast({
      message: "Quiz results updated",
      title: "Success!",
    });
  };
  useEffect(() => {
    if (resultId == null) return;
    void fetchQuizResults();
  }, [resultId]);

  return (
    <PageWrapper>
      {quizResults !== null && (
        <div>
          <Header
            quizResults={quizResults}
            correct={correct}
            points={points}
            collapse={collapse}
            setCollapse={setCollapse}
          />
          {quizResults.gradedResults?.map((q, i) => (
            <Answer
              id={q.question.id ?? 0}
              setGradedQuestions={setGradedQuestions}
              gradedQuestions={gradedQuestions}
              collapse={collapse}
              key={i}
              points={q.result?.points ?? 0}
              term={q.question.term ?? "Term"}
              correct={q.correct}
              correctAnswer={q.question.content ?? "Correct answer"}
              yourAnswer={q.result?.answer}
              assignedPoints={q.question.points}
            />
          ))}
          {user.id === quizResults.quiz?.creator && (
            <Button
              className="my-[20px]"
              label="Update"
              onClick={handleManualResultsUpdate}
            />
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default GradeResult;
