/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GradedResultSchema } from './GradedResultSchema';
import type { QuizResultSchema } from './QuizResultSchema';
import type { QuizSchema } from './QuizSchema';

export type SingleQuizResultResponse = {
    status: string;
    message: string;
    quiz: (QuizSchema | null);
    quizResult: (QuizResultSchema | null);
    gradedResults?: (Array<GradedResultSchema> | null);
    taker: (string | null);
    userType?: (string | null);
    userId?: (number | null);
};

