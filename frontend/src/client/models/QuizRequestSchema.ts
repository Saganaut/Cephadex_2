/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionSchema } from './QuestionSchema';

export type QuizRequestSchema = {
    name: string;
    numQuestions?: number;
    points?: number;
    category?: (string | null);
    subject?: (string | null);
    topic?: (string | null);
    timeCreated?: (string | null);
    dueDate?: (string | null);
    resultReveal?: (boolean | null);
    answerReveal?: (boolean | null);
    timeLimit?: (number | null);
    instructions?: (string | null);
    description?: (string | null);
    shuffle?: (boolean | null);
    img?: (string | null);
    text?: (string | null);
    deckId: number;
    shareId?: (string | null);
    fav?: (boolean | null);
    questions?: (Array<QuestionSchema> | null);
    jeopardy?: (boolean | null);
};

