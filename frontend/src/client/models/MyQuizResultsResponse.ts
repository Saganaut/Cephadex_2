/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuizResultSchema } from './QuizResultSchema';

export type MyQuizResultsResponse = {
    status: string;
    message: string;
    myResults?: (Array<QuizResultSchema> | null);
    myStudentsResults?: (Array<QuizResultSchema> | null);
};

