/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionResultSchema } from './QuestionResultSchema';
import type { QuizResultSchema } from './QuizResultSchema';

export type QuizResultDataResponse = {
    status: string;
    message: string;
    quizResults?: (Array<QuizResultSchema> | null);
    questionResults?: (Array<QuestionResultSchema> | null);
};

