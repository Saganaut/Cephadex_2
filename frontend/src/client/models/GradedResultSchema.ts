/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionResultSchema } from './QuestionResultSchema';
import type { QuestionSchema } from './QuestionSchema';

export type GradedResultSchema = {
    question: QuestionSchema;
    result: (QuestionResultSchema | null);
    correct?: boolean;
};

