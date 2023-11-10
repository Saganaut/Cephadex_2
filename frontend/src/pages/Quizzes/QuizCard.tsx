import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { type Quiz } from "@customTypes/Quiz";
import { CardStructure } from "@common/Cards/CardStructure";
interface QuizCardProps {
  Quiz: Quiz;
}

const QuizCard = ({ Quiz }: QuizCardProps): ReactElement => {
  return (
    <div>
      <CardStructure>
        <div className=" mb-5 border border-aquamarine rounded-lg p-5">
          <h4 className="text-2xl">{Quiz.name} </h4>
          <p>Id: {Quiz.id}</p>
        </div>

        <div className=" border border-blaze-orange rounded-xl p-5"></div>
        <div className=" mt-3">Data:</div>
      </CardStructure>
    </div>
  );
};

export { QuizCard };
