/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuizResultSchema } from './QuizResultSchema';
import type { QuizSchema } from './QuizSchema';
import type { QuizSharingSchema } from './QuizSharingSchema';

export type QuizSharingFullSchema = {
    quiz: QuizSchema;
    share: QuizSharingSchema;
    results: (Array<QuizResultSchema> | null);
};

