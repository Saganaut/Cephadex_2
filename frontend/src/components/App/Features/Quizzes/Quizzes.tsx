import React, { type ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { type Quiz } from "@source/types/Quiz";
import { QuizCard } from "./QuizCard";
import { fetchQuizzesThunk } from "@services/Api/Quiz/QuizApiThunks";

const Quizzes = (): ReactElement => {
  const dispatch = useAppDispatch();
  const quizzes = useAppSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzesThunk());
  }, [dispatch]);
  console.log(quizzes);
  return (
    <>
      <div className="flex flex-wrap mt-40">
        {quizzes.quizzes.length === 0 ? (
          <div>Loading...</div>
        ) : (
          quizzes.quizzes.map((Quiz) => (
            <div key={Quiz.id} className="m-2">
              <QuizCard Quiz={Quiz} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export { Quizzes };
