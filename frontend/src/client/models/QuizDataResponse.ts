/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionSchema } from './QuestionSchema';
import type { QuizSchema } from './QuizSchema';

export type QuizDataResponse = {
    status: string;
    message: string;
    quizzes: Array<QuizSchema>;
    questions: Array<QuestionSchema>;
    userType?: (string | null);
    userId?: (number | null);
    quizShareId?: (string | null);
};

