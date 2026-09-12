/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionRequestSchema } from './QuestionRequestSchema';
import type { QuizRequestSchema } from './QuizRequestSchema';

export type NewQuizRequest = {
    quiz: QuizRequestSchema;
    questions: Array<QuestionRequestSchema>;
};

