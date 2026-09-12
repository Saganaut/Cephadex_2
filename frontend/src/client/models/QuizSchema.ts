/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type QuizSchema = {
    id: number;
    name: string;
    points?: number;
    numQuestions?: number;
    category: (string | null);
    subject: (string | null);
    topic: (string | null);
    timeCreated: string;
    dueDate?: (string | null);
    questions?: null;
    creator: (number | null);
    resultReveal?: boolean;
    answerReveal?: boolean;
    timeLimit: (number | null);
    instructions: (string | null);
    description: (string | null);
    shuffle?: boolean;
    img: (string | null);
    text: (string | null);
    deckId: (number | null);
    fav?: boolean;
    type?: string;
    qtyQuestions?: number;
    jeopardy?: (boolean | null);
};

