/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionResultData } from './QuestionResultData';

export type QuizResultDataRequest = {
    quizId: number;
    startTime?: (string | null);
    endTime?: (string | null);
    questionAnswers?: (Array<QuestionResultData> | null);
};

