import React, { type ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
// import { type Quiz } from "@source/types/Quiz";
import { fetchQuizzesThunk } from "@services/Api/Quiz/QuizApiThunks";

const Quiz = (): ReactElement => {
  return (
    <>
      <div className="flex flex-wrap mt-40">Single quiz</div>
    </>
  );
};

export { Quiz };
